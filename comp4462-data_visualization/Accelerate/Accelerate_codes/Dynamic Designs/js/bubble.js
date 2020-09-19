var mintime = 0;
var maxtime = 24;
var minday = 1;
var maxday = 7;

var minprice = 0;
var maxprice = 97.5;



var Black_true = false;
var BlackSUV_true = false;
var Uberpool_true = false;
var UberX_true = false;
var UberXL_true = false;
var WAV_true = false;



function generate_bubble(){
console.log(minprice);
console.log(maxprice);
Plotly.d3.csv('./rideshare_kaggle-final.csv',
function(err, rows){function unpack(rows, key) {return rows.map(function(row){ return row[key];
})};

var data = [];
var countj = unpack(rows, 'count');
var startLongitude = unpack(rows, 'startLon');
var cabtype= unpack(rows, 'cab_type');
var pricej = unpack(rows, 'price');
var namej= unpack(rows, 'name');
var dayj= unpack(rows, 'weekday');
var hourj= unpack(rows, 'hour');

var width = new Array(12);

for (var i = 0; i < 12; i++) {
          width[i] = new Array(6);
    }

       for (var i = 0; i < 12; i++) {
       for (var j = 0; j< 6; j++) {
        width[i][j] = 0;
    }
    }
    width[0][0]=-71.0810;width[0][1]=42.3503;width[0][6]="Back bay";
    width[1][0]=-71.0707;width[1][1]=42.3588;width[1][6]="Beacon Hill";
    width[2][0]=-71.1054;width[2][1]=42.3505;width[2][6]="Boston University";
    width[3][0]=-71.1003;width[3][1]=42.3429;width[3][6]="Fenway";
    width[4][0]=-71.0550;width[4][1]=42.3559;width[4][6]="Financial District";
    width[5][0]=-71.0570;width[5][1]=42.3620;width[5][6]="Haymarket Square";
    width[6][0]=-71.0542;width[6][1]=42.3647;width[6][6]="North End";
    width[7][0]=-71.0631;width[7][1]=42.3661;width[7][6]="North Station";
    width[8][0]=-71.0892;width[8][1]=42.3398;width[8][6]="NorthEastern University";
    width[9][0]=-71.0552;width[9][1]=42.3519;width[9][6]="South Station";
    width[10][0]=-71.0643;width[10][1]=42.3519;width[10][6]="Threate District";
    width[11][0]=-71.0661;width[11][1]=42.3644;width[11][6]="West End";

    var max=Number(0);
    for ( var a = 0 ; a <countj.length; a++ ) {//can add filter
      var start= startLongitude[a];
      var isUber= cabtype[a];
      var price = Number(pricej[a]);
      var name= namej[a];
      var count=Number(countj[a]);
      var weekday=Number(dayj[a]);
      var hour=Number(hourj[a]);

      var gogo=false;
      //document.write(start);
     // document.write(isUber);
     // document.write(price);
     if(name=="Black"&&Black_true==true){gogo=true;}
     if(name=="Black SUV"&&BlackSUV_true==true){gogo=true;}
     if(name=="UberPool"&&Uberpool_true==true){gogo=true;}
     if(name=="UberX"&&UberX_true==true){gogo=true;}
     if(name=="UberXL"&&UberXL_true==true){gogo=true;}
     if(name=="WAV"&&WAV_true==true){gogo=true;}
     //document.write(max);
      //document.write("<br>");
      for (var i = 0; i < 12; i++) {
             if(width[i][0]==start&&isUber=="Uber"&&price<=Number(97.5)&&gogo==true&&weekday>=minday&&weekday<=maxday&&hour>=mintime&&hour<=maxtime&&price>=minprice&&price<=maxprice)
               {width[i][2]+=price;
               width[i][3]+=count;
               }
        }
    }



    for (var i = 0; i < 12; i++) {
    width[i][4]=Number(width[i][2])/Number(width[i][3]);

    }





   /* for (var i = 0; i < 12; i++) {
    for (var j = 0; j < 5; j++)    {
        document.write(width[i][j] + " ");
    }
    document.write("<br>");
} */

    var lon1=[];
    var lat1=[];
    var total1=[];
    var width1=[];
    var average1=[];
    var test1=[];

    for (var i = 0; i < 12; i++) {

       lon1.push(width[i][0]);
       lat1.push(width[i][1]);
       total1.push(width[i][2]);
       average1.push(width[i][4])
       var temp=width[i][2]/80;
       var test=width[i][6]+"--"+"Ttl:$"+width[i][2]+".Freq:" +width[i][3]+".Avg:$"+Math.round(width[i][4],-1);
       width1.push(temp);
       test1.push(test);

    }


   /*for (var i = 0; i < 12; i++) {
        document.write(width1[i]);
        document.write("<br>");
    }*/
    //document.write(max);
    var data = [{
    type: 'scattermapbox',
    mode: 'markers',
    lon:lon1,
    lat:lat1,
    marker: {size:width1,
    sizemode:"area",
    color: average1,
    colorscale: 'Reds',
    cmin: 0,
    cmax: 50,
    showscale:true,
    //reversescale:true,

    opacity:0.5},

    hovertext:test1,
    hoverinfo:"lon+lat+text",

    }];



    /*for (var i = 0; i < 12; i++) {
    var test="Total: "+width[i][2]+". Frequency: " +width[i][3]+". Average: "+width[i][4];
    var opacityValue = 0.5;
    var color1 = width[i][2];
    var result={
    lon:[width[i][0]],
    lat:[width[i][1]],
    type: "scattermapbox",
    mode: 'markers+test',
    marker:{size: width[i][2]/5000,color:frequency,cmin:300000,cmax:500000, colorscale:'YlOrRd',

    showscale: true},
    coloraxis: 'coloraxis',
    hovertext:test,
    hoverinfo:"all",
    opacity: opacityValue};
    data.push(result);
    }
    /*var data1 = [{
    type: "scattermapbox",
    lat:[],
    lon:,

    }]*/

    /*for (var i = 0; i < 12; i++) {
    document.write(data[0]);

    }*/



    layout = {
      dragmode: 'zoom',
      mapbox: {
        center: {
          lat: 42.353,
          lon: -71.0787
        },
        domain: {
          x: [0, 1],
          y: [0, 1]
        },
        style: 'dark',
        zoom: 12
      },
      margin: {
        r: 0,
        t: 0,
        b: 0,
        l: 0,
        pad: 0
      },
      paper_bgcolor: '#191A1A',
      plot_bgcolor: '#191A1A',
      showlegend: false
   };


config = {mapboxAccessToken: "pk.eyJ1IjoiZmlnb2xpdTIzOSIsImEiOiJjazlza2h0bmgxNTkwM29uMTFoOG50dm1oIn0.lfy3c86TDPd_Dju1moyhXQ"};

Plotly.newPlot('myDiv', data, layout, config);

 });



}
