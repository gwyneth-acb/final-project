from flask import Flask, render_template
from colorthief import ColorThief
import requests
from io import BytesIO
import urllib.parse, urllib.request, urllib.error, json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/getColors/<videoID>", methods=["GET"])
def getColors(videoID):
    domColor = getDomColor(videoID)
    finalScheme = getScheme(domColor[1:].upper())
    return finalScheme

def getDomColor(videoID):


    thumbnail_url = f"https://img.youtube.com/vi/{videoID}/hqdefault.jpg"
    response = requests.get(thumbnail_url)


    if response.status_code == 200:
        thumbnailData = BytesIO(response.content)
        colorThief = ColorThief(thumbnailData)

        domColor = colorThief.get_color(quality=1)  # Adjust quality as needed
        finalCode = rgb_to_hex(domColor)
        return finalCode
    else:
        print("Cannot get dominant color")
        return None

def getScheme(code):
    try:
        request = "https://www.thecolorapi.com/scheme?mode=monochrome&count=5&hex=" + code

        response = urllib.request.urlopen(request)
    except urllib.error.URLError as e:
        print("Error trying to retrieve data")
        print(e.reason)
        return

    datastr = response.read()
    rawScheme = json.loads(datastr)
    cleanScheme = processRawScheme(rawScheme)
    return cleanScheme

#function that takes in the raw data and makes it cleaner
def processRawScheme(rawScheme):
    compiledValues = [color["hex"]["value"] for color in rawScheme["colors"]]
    cleanScheme = [compiledValues[0], compiledValues[2], compiledValues[4]]
    return cleanScheme

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])