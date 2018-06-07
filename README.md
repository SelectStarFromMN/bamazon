# bamazon

**bamazon** is a [node.js](https://nodejs.org/en/) command-line application demonstrating CLI user interaction via *inquirer.js npm* and relational database processing using *mysql npm*.  The use-case is loosely modeled after an online store where the user is presented with a list of products having related informational fields and can choose to purchase a quantity of product.

[inquirer](https://www.npmjs.com/package/inquirer) is used to drive the user interaction, and in spite of some loss in customizable flexibility it still offers a richer user experience than it would be prudent to try to re-invent.  Not to mention the validation mechanism which alone is priceless, or the *".then"* promise mechanism for seamless asynchronous user interactions.  We also make use of the *"when:"* keyword to make dynamic follow-up question-branching decisions.  However, I did find myself wishing it provided "hidden" attributes for stashing an array-index (I considered creating a shadow-array mirroring the choice-array plus the attribute/s I wanted, but decided it was not our objective to add this kind of complexity).  I hope it doesn't sound like I'm harping on *inquirer* though, because that's not my intent.  It's just so awesome that I can imagine some ways to enhance it even further.

At the core of the system is a [mysql](https://www.npmjs.com/search?q=mysql) **"bamazon"** database which maintains our site's product catalog (including pricing and inventory).  The DDL and some sample seed data can be found within the repo (file: *dbseed.sql*).  The mysql node package provides constructors for easily establishing connections to our mysql database and methods for handling our CRUD needs.  For example, we query our database using the *connection.query* method in order to obtain and present a list of products to the user.  We compare in-stock quantities from the database to the desired number of units the user has requested to make sure we can service the user's order before placing it.  Similarly, in-stock records are updated upon successful completion of an order. 

There is also a Manager module (*bamazonManager.js*) which provides for viewing and manipulating product stock, and a Supervisor module (*bamazonSupervisor.js*) which supports departmental-level administration.

This application is useful as an introduction and working example of the CLI + RDBMS online-store concept.

**Video Demonstration**
[Features Demonstration](https://drive.google.com/file/d/1AyOXBfcVNShkN1f1Vv-ZektLqosjQxWC/view "Video Demonstration")


**Screenshots:**
![Customer Module Screenshot](https://github.com/SelectStarFromMN/bamazon/blob/master/bamazonScreenshot1.jpg "Customer Module")

![Manager Module Screenshot](https://github.com/SelectStarFromMN/bamazon/blob/master/managerScreenshot.jpg "Manager Module")

![Supervisor Module Screenshot](https://github.com/SelectStarFromMN/bamazon/blob/master/supervisorScreenshot.jpg "Supervisor Module")
