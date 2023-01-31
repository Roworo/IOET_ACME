# ACME EXERCISE

This program will solve the problem posted by IOET on payment calculation according to hours worked

## Solution

### Customer Requirements

All the requirements are described on the email

### Algorithm

1. Start the software
2. Upload the file
3. If file format is correct continue, if not, return to step number 2
4. Confirm the calculation
5. Read the file, if everything is okay, continue, if not, return to step number 2
6. Map for every line the name, and data
7. Get for each day the amount of hours worked, using the table provided
8. Add all the day amounts for each worker
9. Display the results
10. If want to calculate other, return to step 2, if not, finish

### Technologies to use

Because the software requirements are not that complex, and it should be able to run without any installation or use of package manager, it was decided to use HTML5 for the DOM, CSS3 for styling and Vanilla JavaScript so it can run on any modern browser. Because on the requirements it was explicitly said that the use of external libraries is not allowed, so CSS Frameworks such as bootstrap or JS libraries as JQuery won't be used.

## Usage

Download/Clone the files on the repository, and then open the index.html file with preferred browser.

Upload your .txt file on the format NAME=DDHH:MM-HH:MM,DDHH:MM-HH:MM, our you can use the sample file on the repository.
