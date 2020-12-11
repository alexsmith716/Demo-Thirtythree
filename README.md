# Demo-Thirtythree

### ABOUT:

* Using Babel CLI for Server compile.

* Addressing the `require`ing of static assets server/Node side via babel with `css-modules-require-hook`.
* Only enabling usage of `css-modules-require-hook` for testing with `graphiql`.
* Tried several approaches using babel & LC for server side rendering static assets but none really worked so going with this.
* Pretty sure this usage of LC for SSR is correct but must say not 100% positive! 

https://github.com/node-fetch/node-fetch
https://github.com/matthew-andrews/isomorphic-fetch
https://github.com/lquixada/cross-fetch
https://github.com/developit/unfetch

* GraphQL, REST, AWS/cloud
* TS
* Testing
* Linting


### UPDATE:

* https://www.googleapis.com/books/v1/volumes?q=kaplan%20test%20prep
* https://www.googleapis.com/books/v1/volumes?q=kaplan%20test%20prep
* one endpoint retrieves a list of country names, using mock data

* Update the endpoint to pull country data from http://api.population.io/1.0/countries.
* The endpoint http://api.population.io/1.0/population/:country/:date returns the total population for a given country on a given date.
Design and implement an endpoint in our API that will allow a consumer to specify an arbitrary set of countries and an optional sort order, and receive back a list of countries and their population based on the current date.
If a sort order was specified, return the list sorted on population size, according to the consumer's requested sort order.


### TODO:

* fix: "Warning: Can't perform a React state update on an unmounted component" from `'./component/GraphiQLExample'`
* for above: https://github.com/graphql/graphiql/issues/1515
* for above: (nothing in `issues/1515` fixed my 'Warning' but just a warning so moving on. will check it out after a little Apollo progress)
* whole bunch of other stuff
* test on heroku
