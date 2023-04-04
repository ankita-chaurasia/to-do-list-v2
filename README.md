# to-do-list-v2
Updated version of the to-do list app with a non-relational DB.

Uses mongoose to perform operations.

Also accepts custom parameters in the url, which presents the called list, and if the list doesn't already exists, it creates it with the passed parameter.
For Example, localhost:3000/work - It will bring up the work list if it exists, otherwise it will create a list named 'work'.
