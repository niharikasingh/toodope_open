# toodope_open
Source code for [toodope.org](http://toodope.org)

## How to help: for non-coders
1. If you find a bug, [open an issue](https://github.com/niharikasingh/toodope_open/issues) or contact admin [AT] toodope [DOT] org
1. Upload outlines, write professor reviews, and list textbooks for sale

## How to help: for coders
1. Code and add features to the website

### Setting up your development environment: for everything except uploading files
1. Clone this repo to your machine.
1. Install the following: node 9.10 or more
1. Create a `.env` file using `.env_sample` as a template
1. Install the required node modules by running `npm install`
1. Start the server by running `node server.js`
1. You should now be able to see portions of the website at `localhost:8080`.  The search functionality will be broken on most pages.  To get search working, contact me at admin [AT] toodope [DOT] org to get access to the database.

### Setting up your development environment: for uploading files
1. Do all of the above
1. Install the following: python 3, redis, postgreSQL
1. Install the required python modules by running `pip install requirements.txt`
1. Create an AWS account and add the credentials to `.env` variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.  Create an AWS S3 bucket and add the name to `.env` variable `S3_BUCKET`.  Create a postgreSQL database and add the details to `.env` variables `PG*`.
1. Start redis (`redis-server --daemonize yes`)

## License
MIT

If you're a student org looking to set up your own outline bank, feel free to use this code as a template.

## Other worthy projects
If you're a lawyer or a law school student with a cool project that you want help with or feedback on, list it here.
