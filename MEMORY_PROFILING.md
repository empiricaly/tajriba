# Memory Profiling Guide

This guide explains how to use Tajriba's built-in memory profiling features to debug memory leaks.

## Quick Start for Memory Leak Issues

If you're experiencing memory leaks when the server is idle (no players connected), follow these steps:

### 1. Enable Memory Profiling

Add these flags when starting Tajriba:

```bash
tajriba --memprofile.enabled=true --memprofile.dir=/path/to/profiles --memprofile.interval=2m
```

### 2. Monitor the Issue

The profiler will:
- Write memory profiles every 2 minutes to `/path/to/profiles/`
- Log detailed memory and runtime statistics
- Track active timers and subscriptions

### 3. Trigger Manual Profiles

When you notice memory usage increasing, trigger an immediate profile:

```bash
# Send SIGUSR1 signal to the Tajriba process
kill -USR1 <pid>
```

### 4. Collect Profiles

After the memory leak occurs, collect these files:
- `mem_profile_*.pprof` - Heap profiles
- `goroutine_profile_*.pprof` - Goroutine profiles
- Log files with memory statistics

## Configuration Options

### Command Line Flags

- `--memprofile.enabled`: Enable memory profiling (default: false)
- `--memprofile.dir`: Directory for profile files (default: current directory)
- `--memprofile.interval`: Profile write interval (default: 5m)
- `--memprofile.http_enabled`: Enable HTTP pprof endpoints (default: false)
- `--memprofile.http_port`: HTTP pprof port (default: 6060)

### Configuration File

Add to your `tajriba.json` or `.tajriba.yaml`:

```yaml
memprofile:
  enabled: true
  dir: "/var/log/tajriba/profiles"
  interval: "2m"
  http_enabled: true
  http_port: 6060
```

## HTTP Endpoints (when http_enabled=true)

When HTTP profiling is enabled, these endpoints are available:

- `http://localhost:6060/debug/pprof/` - Profile index
- `http://localhost:6060/debug/pprof/heap` - Heap profile
- `http://localhost:6060/debug/pprof/goroutine` - Goroutine profile
- `http://localhost:6060/debug/pprof/profile` - CPU profile

## Log Messages to Watch

The profiler adds these log messages to help track the issue:

### Memory Statistics (every interval)
```
memory profiler: memory stats context=periodic alloc_mb=150 goroutines=45 active_timers=3
```

### Runtime Statistics (every interval)
```
runtime: state stats context=periodic active_timers=3 total_subscriptions=0 total_steps=10
```

### Timer Activity (debug level)
```
runtime: step timer created stepID=abc123 remaining=30s activeTimers=4
runtime: step timer fired stepID=abc123
runtime: step timer stopped stepID=abc123 activeTimers=3
```

## Analyzing Profiles

### Using Go pprof tool

```bash
# Analyze heap profile
go tool pprof mem_profile_2024-01-15_14-30-00.pprof

# Compare two profiles to see growth
go tool pprof -base=mem_profile_baseline.pprof mem_profile_after_leak.pprof

# Web interface
go tool pprof -http=:8080 mem_profile_2024-01-15_14-30-00.pprof
```

### Key Things to Look For

1. **Growing allocations** in specific functions
2. **Increasing goroutine count** over time
3. **Active timers count** not decreasing when idle
4. **Subscription counts** remaining non-zero when no players connected

## Troubleshooting Steps

### 1. Check Timer Cleanup
Look for these log patterns:
- Timers created but not stopped
- Timer cleanup timeouts
- Active timer count not reaching zero

### 2. Check Subscription Cleanup
Monitor these metrics:
- `total_subscriptions` should be 0 when no players connected
- Check for orphaned WebSocket connections

### 3. Memory Growth Patterns
- Compare profiles before and after game sessions
- Look for objects that aren't being garbage collected

## Example Debugging Session

```bash
# 1. Start with profiling enabled
tajriba --memprofile.enabled=true --memprofile.dir=/tmp/profiles --log.level=debug

# 2. Run your experiment with players
# 3. Wait for all players to disconnect
# 4. Trigger manual profile
kill -USR1 $(pgrep tajriba)

# 5. Wait 10 minutes and trigger another profile
kill -USR1 $(pgrep tajriba)

# 6. Compare profiles
go tool pprof -base=/tmp/profiles/mem_profile_first.pprof /tmp/profiles/mem_profile_second.pprof
```

## Getting Help

When reporting memory leak issues, please include:
1. Memory profile files (.pprof)
2. Log files with memory statistics
3. Steps to reproduce the issue
4. Tajriba version and configuration

The profile files and logs will help identify the root cause of the memory leak. 