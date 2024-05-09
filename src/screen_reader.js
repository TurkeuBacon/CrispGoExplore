class ScreenReader {
    canvas;
    debugCanvas;
    ctx;
    debugCtx;
    debugImageData;
    debugPixelData;
    constructor() {
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.debugCanvas = document.createElement("canvas");
        this.debugCanvas.width = this.canvas.width/5;
        this.debugCanvas.height = this.canvas.height/5;
        this.debugCanvas.style.width = "200px";
        this.debugCanvas.style.border = "3px solid red";
        this.debugCanvas.style.imageRendering = 'pixelated';
        this.debugCtx = this.debugCanvas.getContext('2d');
        this.debugImageData = this.debugCtx.createImageData(this.debugCanvas.width, this.debugCanvas.height);
        this.debugPixelData = this.debugImageData.data;
        document.body.appendChild(this.debugCanvas);
    }
    updateScreen() {
        const downScaledImage = this.getLowResGrayscale();
        for(let i = 0; i < this.debugPixelData.length; i++) {
            this.debugPixelData[i] = downScaledImage[i]*32;
        }
        this.debugCtx.putImageData(this.debugImageData, 0, 0);
    }
    getLowResGrayscale() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const pixelData = imageData.data;
        const downScaledImage = [];
        for(let y = 0; y < this.canvas.height; y+=5) {
            for(let x = 0; x < this.canvas.width; x+=5) {
                let average = 0;
                for(let j = 0; j < 5; j++) {
                    for(let i = 0; i < 5; i++) {
                        const index = ((y+j)*this.canvas.width+x+i)*4;
                        const grayVal = (pixelData[index]+pixelData[index+1]+pixelData[index+2])/3;
                        average += grayVal;
                    }
                }
                average = Math.floor(average/25/32);
                downScaledImage.push(average, average, average, 8);
            }
        }
        return downScaledImage;
    }

    getLowResGrayImageString() {
        const downScaledImage = this.getLowResGrayscale();
        const stringChars = [];
        for(let i = 0; i < downScaledImage.length; i++) {
            stringChars.push(downScaledImage[i]);
        }
        return stringChars.join('');
    }
}
export default ScreenReader