const Chart_model = require("../model/chart_model");
const fs = require("file-system");

function Watcher(){
}

Watcher.prototype.writeCSV = function (req,session){
    if(session){
        const chart_model = new Chart_model(req);
        fs.open("../navigation_data.csv","a", function(err, fd) {
                const nbChart = session.chart ? session.chart.length : 0;
                let totalPrice = 0;
                if(session.chart){session.chart.forEach((product)=>{
                    totalPrice +=  (product.nb * parseFloat(product.product.prix))
                })}
                totalPrice = totalPrice.toFixed(2);
                const ip = session.ip;
                const version = session.MenuNumber;
                const horodateur = new Date(session.connectDateTime).toString();
                const timePass = session.allPing ? (session.allPing.reduce((prev,current)=>{return prev + current})).toFixed(2) : 0;
                const pageAverageTime = session.allPing ? (timePass / session.allPing.length).toFixed(2) : 0;
                const catalogueAverageTime = session.catalogueNav ? (session.catalogueNav.reduce((prev,current)=>{return prev + current}) / session.catalogueNav.length).toFixed(2) : 0;
                const productAverageTime = session.productNav ? (session.productNav.reduce((prev,current)=>{return prev + current}) / session.productNav.length).toFixed(2) : 0;
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
                        req.session.destroy();
                    });
        });
    }else console.log("no sess")
}


module.exports = Watcher;