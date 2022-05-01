const Chart_model = require("../model/chart_model");
const fs = require("file-system");

function Watcher(){
}

Watcher.prototype.writeCSV = function (req,session){
    if(session){
        const chart_model = new Chart_model(req);
        fs.open("./data/navigation_info.csv","a", function(err, fd) {
            const nbChart = chart_model.getChart().length;
            const totalPrice = chart_model.getTotal();
            const ip = session.ip;
            const version = session.MenuNumber;
            const horodateur = new Date(session.connectDateTime).toString();
            const timePass = session.allPing ? (session.allPing.reduce((prev,current)=>{return prev + current})) : 0;
            const pageAverageTime = session.allPing ? (timePass / session.allPing.length) : 0;
            const catalogueAverageTime = session.catalogueNav ? (session.catalogueNav.reduce((prev,current)=>{return prev + current}) / session.catalogueNav.length) : 0;
            const productAverageTime = session.productNav ? (session.productNav.reduce((prev,current)=>{return prev + current}) / session.productNav.length) : 0;
            const nbClick = session.click;
            const nbPageVisited = session.pageVisited;
            const nbMenu = session.clickMenu;

            let buffer = new Buffer.from(version + ";" + horodateur + ";" + timePass + ";" + nbClick + ";" + nbPageVisited + ";" +nbMenu + ";"+ nbChart + ";" + totalPrice + "€;" + pageAverageTime + ";" + catalogueAverageTime + ";" + productAverageTime +";" + ip + "\n");
            fs.write(fd, buffer, 0, buffer.length,
                null, function(err,writtenbytes) {
                    if(err) {
                        console.log('Cant write to file');
                    }else {
                        console.log(writtenbytes +
                            ' characters added to file');
                    }
                })
        });
    }else console.log("no sess")
}


module.exports = Watcher;