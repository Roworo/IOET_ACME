const referenceTable = [
  {
    days: ["MO", "TU", "WE", "TH", "FR"],
    hours: [
      {
        start: 0,
        end: 8,
        pricePerHour: 25,
      },
      {
        start: 9,
        end: 17,
        pricePerHour: 15,
      },
      {
        start: 18,
        end: 24,
        pricePerHour: 20,
      },
    ],
  },
  {
    days: ["SA", "SU"],
    hours: [
      {
        start: 0,
        end: 8,
        pricePerHour: 30,
      },
      {
        start: 9,
        end: 17,
        pricePerHour: 20,
      },
      {
        start: 18,
        end: 23,
        pricePerHour: 25,
      },
    ],
  },
];

async function getPayments() {
  try {
    const text = await readData();
    const formattedData = formatData(text);

    const list = document.getElementById("list-results");
    list.innerHTML = "";

    const messageElement = document.getElementById("error-message");
    messageElement.innerHTML = "";

    formattedData.map((workerSchedule) => {
      const totalPayment = getWorkerPayment(workerSchedule.schedule);
      const text = `The amount to pay to ${workerSchedule.name} is: $${totalPayment} USD`;

      let liElement = document.createElement("li");
      liElement.appendChild(document.createTextNode(text));
      list.appendChild(liElement);
    });
  } catch (err) {
    const messageElement = document.getElementById("error-message");
    messageElement.innerHTML = "";
    messageElement.appendChild(document.createTextNode(err.message));

    const list = document.getElementById("list-results");
    list.innerHTML = "";

    let file = document.getElementById("fileUpload");
    file.value = null;
  }
}

async function readData() {
  try {
    let file = document.getElementById("fileUpload").files[0];
    const text = await file.text();
    return text;
  } catch (err) {
    throw new Error("Error reading the file");
  }
}

const formatData = (rawData) => {
  try {
    const workersList = rawData.split("\r\n");

    const workers = workersList.map((element) => {
      const value = element.split("=");
      const name = value[0];

      const schedule = value[1].split(",").map((day) => {
        let dayInitials = day.slice(0, 2);
        let [start, end] = day.substring(2).split("-");

        return {
          dayInitials,
          start: start.split(":")[0],
          end: end.split(":")[0],
        };
      });

      return {
        name,
        schedule,
      };
    });

    return workers;
  } catch (err) {
    throw new Error(
      "Error reading text contents, review the correct format is used Name=DDHH:MM-HH:MM,DDHH:MM-HH:MM"
    );
  }
};

const getWorkerPayment = (workerSchedule) => {
  try {
    let total = 0;
    workerSchedule.map((day) => {
      referenceTable.map((tableRow) => {
        if (tableRow.days.includes(day.dayInitials)) {
          const paymentPerDay = getDayPayment(tableRow.hours, day);
          total += paymentPerDay;
        }
      });
    });
    return total;
  } catch (err) {
    throw new Error("Error calculating payment, review hours");
  }
};

const getDayPayment = (hoursRef, workerHours) => {
  try {
    let startRange, endRange;
    let startInt = parseInt(workerHours.start);
    let endInt = parseInt(workerHours.end);
    for (let i = 0; i < hoursRef.length; i++) {
      if (hoursRef[i].start <= startInt && startInt <= hoursRef[i].end)
        startRange = i;
      if (hoursRef[i].start <= endInt && endInt <= hoursRef[i].end)
        endRange = i;
    }

    if (startRange === endRange) {
      return (endInt - startInt) * hoursRef[startRange].pricePerHour;
    }
    if (endRange - startRange === 1) {
      let pay1 =
        (hoursRef[startRange].end + 1 - startInt) *
        hoursRef[startRange].pricePerHour;
      let pay2 =
        (endInt - hoursRef[endRange].start) * hoursRef[endRange].pricePerHour;

      return pay1 + pay2;
    }
    if (endRange - startRange === 2) {
      let pay1 =
        (hoursRef[startRange].end + 1 - startInt) *
        hoursRef[startRange].pricePerHour;
      let pay2 =
        (endInt - hoursRef[endRange].start) * hoursRef[endRange].pricePerHour;
      let pay3 =
        (hoursRef[1].end - hoursRef[1].start) * hoursRef[1].pricePerHour;
      return pay1 + pay2 + pay3;
    }
  } catch (err) {
    throw new Error("Error calculating payment, review hours");
  }
};

//******************************************************* */
//TESTS
//******************************************************* */
(function () {
  "use strict";

  /**
   * test function
   * @param {string} desc
   * @param {function} fn
   */
  function it(desc, fn) {
    try {
      fn();
      console.log("\x1b[32m%s\x1b[0m", "\u2714 " + desc);
    } catch (error) {
      console.log("\n");
      console.log("\x1b[31m%s\x1b[0m", "\u2718 " + desc);
      console.error(error);
    }
  }

  function compareObjects(element1, element2) {
    return JSON.stringify(element1) === JSON.stringify(element2);
  }

  it("Get Day Payment works as expected", () => {
    const mockedWorkerHours = {
      start: 10,
      end: 11,
    };
    const mockedResult = getDayPayment(
      referenceTable[0].hours,
      mockedWorkerHours
    );

    if (mockedResult !== 15) throw new Error();
  });

  it("Get Worker Payment works as expected", () => {
    const mockedWorkerSchedule = [
      {
        dayInitials: "MO",
        start: 10,
        end: 11,
      },
      {
        dayInitials: "TU",
        start: 10,
        end: 11,
      },
    ];

    const mockedResult = getWorkerPayment(mockedWorkerSchedule);

    if (mockedResult !== 30) throw new Error();
  });

  it("Format Data works as expected", () => {
    const mockedText =
      "JENNIFER=TH05:00-11:00,SA09:00-13:00,SU10:00-17:00\r\nPETER=TU11:00-13:00,WE08:00-15:00,FR10:00-16:00";

    const mockedResult = formatData(mockedText);

    const mockedResultExpected = [
      {
        name: "JENNIFER",
        schedule: [
          {
            dayInitials: "TH",
            start: "05",
            end: "11",
          },
          {
            dayInitials: "SA",
            start: "09",
            end: "13",
          },
          {
            dayInitials: "SU",
            start: "10",
            end: "17",
          },
        ],
      },
      {
        name: "PETER",
        schedule: [
          {
            dayInitials: "TU",
            start: "11",
            end: "13",
          },
          {
            dayInitials: "WE",
            start: "08",
            end: "15",
          },
          {
            dayInitials: "FR",
            start: "10",
            end: "16",
          },
        ],
      },
    ];

    if (!compareObjects(mockedResult, mockedResultExpected)) throw new Error();
  });

  it("Renders page correctly", () => {
    window.onload = function () {
      let loadedContainer = document.body.innerHTML;

      let container = new DOMParser().parseFromString(
        loadedContainer,
        "text/html"
      ).body;

      const button = container.querySelector("button");
      const errorMessage = container.querySelector("#error-message");
      const list = container.querySelector("#list-results");

      if (button.innerText !== "Calculate") throw new Error();
      if (errorMessage.innerText !== "") throw new Error();
      if (list.innerText !== "") throw new Error();
    };
  });
})();
