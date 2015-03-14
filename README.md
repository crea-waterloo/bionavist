# CREA-Web-App
Interactive visualization for relations extracted by NLP of biological article abstracts found on PubMed.

## How to Run
Run `npm install` after cloning the repository to install all the node dependencies.

Before running, make a copy of `config.sh.example`, name it `config.sh`, and update `config.sh`'s environment variables to reflect the configurations on the local machine. For example, one might choose to update the `PG_CONN` environment variable, which refers to the PostgreSQL connection string. After updating the environment variables, source it: `source config.sh`.

To start the server, do `node server.js [PORT NUMBER]`.
