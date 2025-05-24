package memprofile

import (
	"context"
	"fmt"
	"net/http"
	_ "net/http/pprof" // Enable pprof endpoints
	"os"
	"path/filepath"
	"runtime"
	"runtime/pprof"
	"time"

	"github.com/rs/zerolog/log"
)

// Config holds memory profiling configuration
type Config struct {
	Enabled     bool
	Dir         string
	Interval    time.Duration
	HTTPEnabled bool
	HTTPPort    int
}

// DefaultConfig returns default memory profiling configuration
func DefaultConfig() Config {
	return Config{
		Enabled:     false,
		Dir:         ".",
		Interval:    5 * time.Minute,
		HTTPEnabled: false,
		HTTPPort:    6060,
	}
}

// Profiler manages memory profiling
type Profiler struct {
	config               Config
	cancel               context.CancelFunc
	runtimeStatsCallback func(string) // Optional callback to log runtime stats
}

// Start begins memory profiling based on configuration
func Start(ctx context.Context, config Config) (*Profiler, error) {
	if !config.Enabled {
		return &Profiler{config: config}, nil
	}

	// Set default values
	if config.Dir == "" {
		config.Dir = "."
	}
	if config.Interval == 0 {
		config.Interval = 5 * time.Minute
	}
	if config.HTTPPort == 0 {
		config.HTTPPort = 6060
	}

	// Ensure directory exists
	if err := os.MkdirAll(config.Dir, 0o755); err != nil {
		return nil, fmt.Errorf("failed to create profile directory: %w", err)
	}

	ctx, cancel := context.WithCancel(ctx)
	profiler := &Profiler{
		config: config,
		cancel: cancel,
	}

	// Start HTTP pprof server if enabled
	if config.HTTPEnabled {
		go func() {
			addr := fmt.Sprintf(":%d", config.HTTPPort)
			log.Info().
				Str("addr", addr).
				Msg("memory profiler: starting pprof HTTP server")

			server := &http.Server{Addr: addr}
			go func() {
				<-ctx.Done()
				server.Close()
			}()

			if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
				log.Error().Err(err).Msg("memory profiler: pprof HTTP server failed")
			}
		}()
	}

	// Start periodic memory profiling
	go profiler.periodicProfile(ctx)

	// Log initial memory stats
	profiler.logMemoryStats("startup")

	return profiler, nil
}

// SetRuntimeStatsCallback sets a callback function to log runtime stats
func (p *Profiler) SetRuntimeStatsCallback(callback func(string)) {
	p.runtimeStatsCallback = callback
}

// Stop stops the memory profiler
func (p *Profiler) Stop() {
	if p.cancel != nil {
		p.cancel()
	}
}

// periodicProfile writes memory profiles at regular intervals
func (p *Profiler) periodicProfile(ctx context.Context) {
	ticker := time.NewTicker(p.config.Interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			p.writeMemProfile()
			p.logMemoryStats("periodic")
			if p.runtimeStatsCallback != nil {
				p.runtimeStatsCallback("periodic")
			}
		}
	}
}

// WriteMemProfile writes a memory profile to disk
func (p *Profiler) WriteMemProfile() {
	if !p.config.Enabled {
		return
	}
	p.writeMemProfile()
}

func (p *Profiler) writeMemProfile() {
	timestamp := time.Now().Format("2006-01-02_15-04-05")
	filename := filepath.Join(p.config.Dir, fmt.Sprintf("mem_profile_%s.pprof", timestamp))

	f, err := os.Create(filename)
	if err != nil {
		log.Error().Err(err).Str("file", filename).Msg("memory profiler: failed to create profile file")
		return
	}
	defer f.Close()

	runtime.GC() // Force garbage collection before profiling
	if err := pprof.WriteHeapProfile(f); err != nil {
		log.Error().Err(err).Str("file", filename).Msg("memory profiler: failed to write heap profile")
		return
	}

	log.Info().
		Str("file", filename).
		Msg("memory profiler: wrote heap profile")

	// Also write goroutine profile
	goroutineFile := filepath.Join(p.config.Dir, fmt.Sprintf("goroutine_profile_%s.pprof", timestamp))
	if gf, err := os.Create(goroutineFile); err == nil {
		defer gf.Close()
		if err := pprof.Lookup("goroutine").WriteTo(gf, 0); err != nil {
			log.Error().Err(err).Str("file", goroutineFile).Msg("memory profiler: failed to write goroutine profile")
		} else {
			log.Info().Str("file", goroutineFile).Msg("memory profiler: wrote goroutine profile")
		}
	}
}

// logMemoryStats logs current memory statistics
func (p *Profiler) logMemoryStats(context string) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	log.Info().
		Str("context", context).
		Uint64("alloc_mb", m.Alloc/1024/1024).
		Uint64("total_alloc_mb", m.TotalAlloc/1024/1024).
		Uint64("sys_mb", m.Sys/1024/1024).
		Uint64("heap_alloc_mb", m.HeapAlloc/1024/1024).
		Uint64("heap_sys_mb", m.HeapSys/1024/1024).
		Uint64("heap_idle_mb", m.HeapIdle/1024/1024).
		Uint64("heap_inuse_mb", m.HeapInuse/1024/1024).
		Uint64("heap_released_mb", m.HeapReleased/1024/1024).
		Uint64("heap_objects", m.HeapObjects).
		Uint32("gc_cycles", m.NumGC).
		Int("goroutines", runtime.NumGoroutine()).
		Msg("memory profiler: memory stats")
}

// LogRuntimeStats logs runtime state for debugging
func LogRuntimeStats(context string, activeTimers int, activeSubscriptions map[string]int) {
	totalSubs := 0
	for _, count := range activeSubscriptions {
		totalSubs += count
	}

	log.Info().
		Str("context", context).
		Int("active_timers", activeTimers).
		Int("total_subscriptions", totalSubs).
		Interface("subscription_breakdown", activeSubscriptions).
		Msg("memory profiler: runtime stats")
}

// ForceProfile forces an immediate memory profile write
func (p *Profiler) ForceProfile() {
	if !p.config.Enabled {
		log.Warn().Msg("memory profiler: profiling not enabled")
		return
	}

	p.writeMemProfile()
	p.logMemoryStats("forced")
}
