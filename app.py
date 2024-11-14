from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

#make /get colors  root that takes in a video id
    # use the video id to get the video's thumbnail URL
    # use either urlib or requests to read the binary data of the image
    # use pillow (a pil) to open the image
    # use colorthief to get the dominant color
    # get color scheme from that function
    # return color scheme
