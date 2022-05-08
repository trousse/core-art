const ModelHelper = require("../helper/model_helper");

const modelHelper = new ModelHelper();

function Chart_model(req){
    this.req = req;
}

Chart_model.prototype.getChart = function (){
    return new Promise((resolve) => {
            resolve(this.req.session.chart || []);
    })
}

Chart_model.prototype.postChart = async function (id, categorie){
    let chart = await this.getChart();
    return new Promise((resolve) => {
        const newProduct = {
            nb: 1,
            product: modelHelper.getProductData(categorie, id)
        };
        chart.push(newProduct);
        this.req.session.reload(() => {
            this.req.session.chart = chart;
            this.req.session.save(() => {
                resolve(JSON.stringify(newProduct));
            });
        });
    });
}

Chart_model.prototype.PlusChart = async function (id, categorie){
    let charts = await this.getChart();
    return new Promise((resolve) => {
        let index = charts.findIndex((chart) => {
            return (chart.product.id == id && chart.product.categorie === categorie);
        });
        this.req.session.reload(() => {
             this.req.session.chart[index].nb++;
            this.req.session.save(() => {
                resolve();
            })
        })
    });
}

Chart_model.prototype.MoinChart = async function (id, categorie){
    let charts = await this.getChart();
    return new Promise((resolve) => {
        let index = charts.findIndex((chart) => {
            return (chart.product.id == id && chart.product.categorie === categorie);
        });
        this.req.session.reload(() => {
        if (this.req.session.chart[index].nb > 1) this.req.session.chart[index].nb--;
            this.req.session.save(() => {
                resolve();
            })
        })
    });
}

Chart_model.prototype.DeleteChart = async function (id, categorie){
    let charts = await this.getChart();
    return new Promise((resolve) => {
        this.req.session.reload(() => {
        this.req.session.chart = charts.filter((chart) => {
            return (!(chart.product.id == id && chart.product.categorie === categorie));
        });
            this.req.session.save(() => {
                resolve(true);
            })
        })
    });
}

Chart_model.prototype.getTotal = async function (){
    let charts = await this.getChart();
    return new Promise((resolve) => {
        resolve(charts.total || 0);
    });
}

module.exports = Chart_model;