const ModelHelper = require("../helper/model_helper");

const modelHelper = new ModelHelper();

function Chart_model(req){
    this.req = req;
}

Chart_model.prototype.getChart = function (){
    return this.req.session.chart || [];
}

Chart_model.prototype.postChart = function (id, categorie){
    let chart = this.getChart();
    const newProduct = {
        nb: 1,
        product: modelHelper.getProductData(categorie, id)
    };
    chart.push(newProduct);
    this.req.session.chart = chart;
    return JSON.stringify(newProduct);
}

Chart_model.prototype.PlusChart = function (id, categorie){
    let charts = this.getChart();
    let index = charts.findIndex((chart)=>{
        return (chart.product.id == id && chart.product.categorie === categorie);
    });
    this.req.session.chart[index].nb++;
}

Chart_model.prototype.MoinChart = function (id, categorie){
    let charts = this.getChart();
    let index = charts.findIndex((chart)=>{
        return (chart.product.id == id && chart.product.categorie === categorie);
    });
    if(this.req.session.chart[index].nb > 1) this.req.session.chart[index].nb--;
}

Chart_model.prototype.DeleteChart = function (id, categorie){
    let charts = this.getChart();
    this.req.session.chart = charts.filter((chart)=>{
        return !(chart.product.id == id && chart.product.categorie === categorie);
    });
   return true;
}

Chart_model.prototype.getTotal = function (){
    let charts = this.getChart();
    return charts.total || 0;
}

module.exports = Chart_model;