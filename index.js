var cron = require("node-cron");
const login = require("facebook-chat-api");
var parse = require("node-html-parser");
var fs = require("fs");

var read_input = () =>
  new Promise((resolve, reject) => {
    fs.readFile("input.txt", (er, data) => {
      resolve(data.toString());
    });
  });

read_input()
  .then(data => {
    // console.log(data);
    const root = parse.parse(data);
    var list_task_old = root.querySelectorAll(".odd");
    var list_task_even = root.querySelectorAll(".even");
    // console.log(list_task[0].childNodes[1].childNodes[0].rawText);
    var list = [];
    list_task_old.forEach(element => {
      var item = [];
      for (var i = 1; i <= 11; i = i + 2) {
        item.push(element.childNodes[i].childNodes[0].rawText.trim());
      }
      list.push(item);
    });

    list_task_even.forEach(element => {
      var item = [];
      for (var i = 1; i <= 11; i = i + 2) {
        item.push(element.childNodes[i].childNodes[0].rawText.trim());
      }
      list.push(item);
    });
    return list;
  })
  .then(list => {
    // Method
    var time = str => {
      var time = {};
      time.date = str.slice(0, 2);
      var s = str.indexOf("(");
      var e = str.indexOf(")");
      time.clock = str.slice(s + 1, e);

      return time;
    };

    var date_process = str => {
      switch (str) {
        case "T2":
          return 1;
        case "T3":
          return 2;
        case "T4":
          return 3;
        case "T5":
          return 4;
        case "T6":
          return 5;
        case "T7":
          return 6;
        default:
          break;
      }
    };

    var clock_process = str => {
      var clock = str.split("-")[0];
      switch (clock) {
        case "1":
          return "30 7";
        case "2":
          return "20 8";
        case "3":
          return "20 9";
        case "3.5":
          return "30 7";
        case "4":
          return "10 10";
        case "5":
          return "10 11";
        case "6":
          return "30 12";
        case "7":
          return "20 13";
        case "8":
          return "20 14";
        case "8.5":
          return "45 14";
        case "9":
          return "10 15";
        case "10":
          return "10 16";
        default:
          return "0 0";
      }
    };

    // End Method

    list.forEach(element => {
      element.push(time(element[4]));
    });

    // console.log(list);

    list.forEach(element => {
      // console.log(element);
      var date = date_process(element[6].date);
      var clock = clock_process(element[6].clock);
      var set_time = "* "+clock+" * * * "+date;
      var message = "";
      element.forEach((ele, ind)=>{
        if (ind<6)
        message = message + ele + "\n";
      })
      cron.schedule(set_time, () => {
          login({email: "0326255330", password: "12211221"}, (err, api) => {
            if(err) return console.error(err);
            api.sendMessage(message, "100015834401721");
          });
      });

    });
  });

// var task = cron.schedule('* * * * * *', () => {
//   console.log('running a task every minute');
//   login({email: "0326255330", password: "12211221"}, (err, api) => {
//     if(err) return console.error(err);
//     api.sendMessage("hello world", "100015834401721");
//   });
// });

// setTimeout(()=>{task.stop()}, 1000)
