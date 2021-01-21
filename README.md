# Demo-Thirtythree

### ABOUT:

* Using Babel CLI for Server compile.

* Tried several approaches using babel & LC for server side rendering static assets but none really worked so going with this.
* Pretty sure this usage of LC for SSR is correct but must say not 100% positive! 

* GraphQL, REST, AWS/cloud
* TS
* Testing
* Linting


### UPDATE:

* preload dynamic imports ssr
* https://webpack.js.org/configuration/node/#nodeprocess
* https://webpack.js.org/configuration/resolve/#resolvefallback
* https://webpack.js.org/configuration/resolve/#resolvealias
* https://nodejs.org/docs/latest/api/globals.html


### TODO:

* GoogleBooks API:
* ------------------------------------------
* User can query for any books
* Two objects returned per query and are paginated
* User can discard/remove a queried book
* User can 'favorite/star' a book (book is saved to dB) (cache in place of dB)
* The 'favorite/star' book is placed in chosen dB 'favorite' container
* User can view all favorites from selected 'favorite' container
* User can discard/remove a saved dB book

* Rick And Morty API:
* ------------------------------------------
* User can query for any character
* 'next' button will query for next character ID until all ID's are cached/queried
* User can query for all characters
* User can query for a list of characters (2, 8, 1, 11)
