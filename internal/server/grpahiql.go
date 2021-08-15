package server

import (
	"net/http"
	"text/template"

	"github.com/julienschmidt/httprouter"
)

const graphiqlPageStr = `<html>
<head>
  <title>{{.title}}</title>
  <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
</head>
<body style="margin: 0;">
  <div id="graphiql" style="height: 100vh;"></div>

  <script
	crossorigin
	src="https://unpkg.com/react/umd/react.production.min.js"
  ></script>
  <script
	crossorigin
	src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
  ></script>
  <script
	crossorigin
	src="https://unpkg.com/graphiql/graphiql.min.js"
  ></script>

  <script>
  	const url = location.protocol + '//' + location.host + '{{.endpoint}}';
	console.log(url);
	const fetcher = GraphiQL.createFetcher(url);

	ReactDOM.render(
	  React.createElement(GraphiQL, { fetcher: fetcher }),
	  document.getElementById('graphiql'),
	);
  </script>
</body>
</html>
`

func graphiql(title, endpoint string) httprouter.Handle {
	graphiqlPage := template.Must(template.New("graphiql").Parse(graphiqlPageStr))

	return func(w http.ResponseWriter, _ *http.Request, _ httprouter.Params) {
		w.Header().Add("Content-Type", "text/html")

		err := graphiqlPage.Execute(w, map[string]string{
			"title":    title,
			"endpoint": endpoint,
		})
		if err != nil {
			http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		}
	}
}
