var QRCode = require('qrcode')

const Qr_code = async(doc)=>{
    doc = JSON.stringify(doc)
    const qr =await QRCode.toDataURL(doc)
    return qr;
}

module.exports = {Qr_code}