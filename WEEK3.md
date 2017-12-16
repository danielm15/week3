# Assignment - Week 3

* [ x ] Url to your Jenkins instance: http://ec2-54-76-134-192.eu-west-1.compute.amazonaws.com:8080
* [ ] Url to your live TicTacToe instance
* [ x ] Public Url to your Datadog: https://p.datadoghq.com/sb/efc8564de-ef93f60c7f

  * [ x ] Completed the migrations needed for the application to work
    * Created a database migration using db-migrate create called 20171214145012-add-aggregate-id.js 
that uses the SQL API function addColumn to add the column aggregate_id to the event log db
  * [ x ] On Git push Jenkins pulls my code and the Tic Tac Toe application is deployed through a build pipeline, but only if all my tests are successful
    * Builds sometimes fail due to memory problems but otherwise work fine.
  * [ ] Filled out the `Assignments:` for the API and Load tests
    * TODO: Where are the comments found
  * [ ] The API and Load test run in my build pipeline on Jenkins and everything is cleaned up afterwards
    * TODO: If something is not working, list it.
  * [ x ] My test reports are published in Jenkins
    * TODO: If something is not working, list it.
  * [ ] My Tic Tac Toe game works, two people can play a game till the end and be notified who won.
    * TODO: If something is not working, list it.
  * [ ] My TicCell is tested
    * 
  * [ x ] I've set up Datadog
    * Datadog tends to draw alot of the ec2 instance memory and since the t2.micro machine has such a small memory capacity it can sometimes run out of memory and crash the pipeline, this could be easily fixed by enlarging the instance type.
