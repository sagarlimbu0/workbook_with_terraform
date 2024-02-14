import os
from flask import Flask, request, render_template, send_from_directory, url_for

## chagne the app name to application as reqd by Elastic Beanstalk

# app= Flask(__name__)
application= Flask(__name__)


@application.route('/')
def home():
#    files= url_for('static')
    return render_template("map.html")# , files= files)

@application.route("/get_world_map")
def get_world_map():
    # return send_from_directory('static/data', "world.geojson", as_attachment=True, mimetype='application/json')
    return send_from_directory('static/data', "ne_110m_ocean.geojson", as_attachment=True, mimetype='application/json')


@application.route("/get_climate_data")
def get_oco2_data():
#    return send_from_directory("static/data/oco2_anomalies/", "xco2_anomalies_2014_shorten.csv", as_attachment= True, mimetype="application/json")
#    return send_from_directory("static/data/oco2_anomalies/", "oco2_anomalies_2014.csv", as_attachment= True, mimetype= "application/json")

    filename= request.args.get('filename') + '.csv'
    return send_from_directory("static/data/climate", filename, as_attachment= True, mimetype= 'text/csv')

if __name__ == "__main__":
    application.debug= True
    application.run()

