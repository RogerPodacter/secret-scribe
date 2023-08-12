'use client';

import { useSendTransaction, useWaitForTransaction, useAccount } from 'wagmi';
import { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export function Ethscribe() {
  var CryptoJS = require('crypto-js');
  
  const { data, error, isLoading, isError, sendTransaction } =
    useSendTransaction();
  const { isLoading: isPending, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const account = useAccount();

  const [text, setText] = useState('');

  const [recipient, setRecipient] = useState(account?.address || '');
  
  const [password, setPassword] = useState('')
  
  const ready = password && text
  
  const ciphertext = ready ? CryptoJS.AES.encrypt(`DECRYPTED_MESSAGE:${text}`, password).toString() : ''

  const html = ready ? templateMin(ciphertext) : ""
  // const html = ready ? template(ciphertext) : ""
  
  const dataURI = ready ? 'data:text/html;base64,' + btoa(html) : ''
  
  const hexedURI = Buffer.from(dataURI).toString('hex')
  
  const onEthscribe = async () => {
    if (!recipient) {
      alert('You must enter a recipient');
      return
    }
    
    if (!ready || !hexedURI) return;
    
    if (!account || !account.isConnected || !account.address) {
      alert(
        'You must connect your wallet to ethscribe'
        // 'You must connect your wallet to ethscribe, or copy the hex and send the transaction manually'
      );
      return;
    }

    sendTransaction({
      to: recipient,
      data: `0x${hexedURI}`,
    });
  }
  
  // if (typeof "window" !== "undefined") {
  //   window.CryptoJS = CryptoJS
  //   window.hexedURI = hexedURI
  //   window.dataURI = dataURI
  //   window.text = text
  //   window.ciphertext = ciphertext
  //   window.error = error
  // }
  
  return (
    <div
    
    style={{
      fontFamily: "Inter"
    }}
    className="ethscribe-container">
      <h4>Message Recipient</h4>
      <input
      className="ethscribe-input"
      onChange={e => setRecipient(e.target.value)}
      value={recipient}
      placeholder="Message Recipient"
      style={{
        fontSize: 14,
        fontFamily: "monospace"
      }}
      >
      </input>
      
      <h4>Secret Message</h4>
      
      <TextareaAutosize
      cacheMeasurements
      className="ethscribe-input"
      name="text"
      placeholder="Your secret message"
      onChange={e => setText(e.target.value)}
      value={text}
      minRows={10}
      style={{
        padding: '20px',
        fontSize: 14,
        backgroundColor: "#f7f7f7",
        border: "0",
        resize: 'none',
        borderRadius: 4,
        fontFamily: "monospace"
      }}
      />
      
      <h4>Secret Password</h4>
      <input
      className="ethscribe-input"
      onChange={e => setPassword(e.target.value)}
      value={password}
      placeholder="Your Secret Password"
      type="password"
      style={{
        fontFamily: 'monospace'
      }}
      >
      </input>
      
      <h4>Ethscription Preview</h4>
      
      <iframe
      seamless
      style={{width: '100%', height: '400px',
      borderRadius: 4,
      border: '1px solid #ccc', marginBottom: '25px'}}
      
      src={dataURI}></iframe>
      
      <button className="ethscribe-button" type="button"
      onClick={onEthscribe} style={{fontSize: 20, fontWeight: 300}}>
        ETHSCRIBE
      </button>

      {isLoading && <div className="ethscribe-message">Check wallet...</div>}
      {isPending && (
        <div className="ethscribe-message">Transaction pending...</div>
      )}
      {isSuccess && (
        <>
          <div className="ethscribe-message">
            Success!{' '}
            <a href={`https://etherscan.io/tx/${data?.hash}`}>View Txn</a>{' '}
            <a href={`https://ethscriptions.com/${account?.address}`}>
              View your Ethscriptions
            </a>
          </div>
        </>
      )}
      {isError && (
        <div className="ethscribe-message" style={{fontSize: 14, color: "darkred"}}>Error: {error?.shortMessage}</div>
      )}
      <style jsx>{`
        .ethscribe-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 600px;
        }

        .ethscribe-input,
        .ethscribe-encoded-text,
        .ethscribe-hex {
          font-size: 16px;
          font-family: 'Inter', sans-serif;
          margin-bottom: 10px;
          background-color: #f7f7f7;
          padding: 10px;
          border-radius: 4px;
          border: none;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .ethscribe-button {
          background-color: #4285f4;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 10px;
          font-family: 'Inter', sans-serif;
        }

        .ethscribe-message {
          margin-top: 20px;
          width: 100%;
          text-align: center;
        }

        .ethscribe-message.success {
          color: green;
        }

        .ethscribe-message.error {
          color: red;
        }
      `}</style>
    </div>
  );
}

function templateMin(message:string) {
  return `
  <!doctype html>
  <html lang=en>
  <head>
  <meta charset=UTF-8>
  <meta name=viewport content="width=device-width,initial-scale=1">
  <title>Enter Password</title>
  <style>*{box-sizing:border-box}body{font-family:monospace;background-color:#f0f0f0;color:#333;margin:0;padding:0}#container{width:100%;max-width:600px;margin:auto;text-align:center;padding:16px}#content{padding:20px;background:#fff;border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,.1)}#password{width:100%;padding:10px;font-size:16px;border:1px solid #aaa;border-radius:4px;font-family:monospace}#decrypted-content,#encrypted-content{white-space:pre-wrap;margin:1em 0;text-align:left;font-size:14px;transition:opacity .5s ease;overflow-wrap:break-word}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.fade-in{animation:fadeIn .25s ease-in-out}</style>
  </head>
  <body>
  <div id=container>
  <div id=content>
  <p>Enter password to decrypt message</p>
  <input placeholder="Enter password" type=password id=password>
  <div id=decrypted-content></div>
  <div id=encrypted-content>${message}</div>
  </div>
  </div>
  <script>var CryptoJS=CryptoJS||function(t,e){var r={},n=r.lib={},i=function(){},s=n.Base={extend:function(t){i.prototype=this;var e=new i;return t&&e.mixIn(t),e.hasOwnProperty("init")||(e.init=function(){e.$super.init.apply(this,arguments)}),e.init.prototype=e,e.$super=this,e},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},o=n.WordArray=s.extend({init:function(t,e){t=this.words=t||[],this.sigBytes=null!=e?e:4*t.length},toString:function(t){return(t||a).stringify(this)},concat:function(t){var e=this.words,r=t.words,n=this.sigBytes;if(t=t.sigBytes,this.clamp(),n%4)for(var i=0;i<t;i++)e[n+i>>>2]|=(r[i>>>2]>>>24-i%4*8&255)<<24-(n+i)%4*8;else if(65535<r.length)for(i=0;i<t;i+=4)e[n+i>>>2]=r[i>>>2];else e.push.apply(e,r);return this.sigBytes+=t,this},clamp:function(){var e=this.words,r=this.sigBytes;e[r>>>2]&=4294967295<<32-r%4*8,e.length=t.ceil(r/4)},clone:function(){var t=s.clone.call(this);return t.words=this.words.slice(0),t},random:function(e){for(var r=[],n=0;n<e;n+=4)r.push(4294967296*t.random()|0);return new o.init(r,e)}}),c=r.enc={},a=c.Hex={stringify:function(t){var e=t.words;t=t.sigBytes;for(var r=[],n=0;n<t;n++){var i=e[n>>>2]>>>24-n%4*8&255;r.push((i>>>4).toString(16)),r.push((15&i).toString(16))}return r.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n+=2)r[n>>>3]|=parseInt(t.substr(n,2),16)<<24-n%8*4;return new o.init(r,e/2)}},f=c.Latin1={stringify:function(t){var e=t.words;t=t.sigBytes;for(var r=[],n=0;n<t;n++)r.push(String.fromCharCode(e[n>>>2]>>>24-n%4*8&255));return r.join("")},parse:function(t){for(var e=t.length,r=[],n=0;n<e;n++)r[n>>>2]|=(255&t.charCodeAt(n))<<24-n%4*8;return new o.init(r,e)}},h=c.Utf8={stringify:function(t){try{return decodeURIComponent(escape(f.stringify(t)))}catch(t){throw Error("Malformed UTF-8 data")}},parse:function(t){return f.parse(unescape(encodeURIComponent(t)))}},u=n.BufferedBlockAlgorithm=s.extend({reset:function(){this._data=new o.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=h.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var r=this._data,n=r.words,i=r.sigBytes,s=this.blockSize,c=i/(4*s);if(e=(c=e?t.ceil(c):t.max((0|c)-this._minBufferSize,0))*s,i=t.min(4*e,i),e){for(var a=0;a<e;a+=s)this._doProcessBlock(n,a);a=n.splice(0,e),r.sigBytes-=i}return new o.init(a,i)},clone:function(){var t=s.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0});n.Hasher=u.extend({cfg:s.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){u.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(e,r){return new t.init(r).finalize(e)}},_createHmacHelper:function(t){return function(e,r){return new p.HMAC.init(t,r).finalize(e)}}});var p=r.algo={};return r}(Math);!function(){var t=CryptoJS,e=t.lib.WordArray;t.enc.Base64={stringify:function(t){var e=t.words,r=t.sigBytes,n=this._map;t.clamp(),t=[];for(var i=0;i<r;i+=3)for(var s=(e[i>>>2]>>>24-i%4*8&255)<<16|(e[i+1>>>2]>>>24-(i+1)%4*8&255)<<8|e[i+2>>>2]>>>24-(i+2)%4*8&255,o=0;4>o&&i+.75*o<r;o++)t.push(n.charAt(s>>>6*(3-o)&63));if(e=n.charAt(64))for(;t.length%4;)t.push(e);return t.join("")},parse:function(t){var r=t.length,n=this._map;(i=n.charAt(64))&&(-1!=(i=t.indexOf(i))&&(r=i));for(var i=[],s=0,o=0;o<r;o++)if(o%4){var c=n.indexOf(t.charAt(o-1))<<o%4*2,a=n.indexOf(t.charAt(o))>>>6-o%4*2;i[s>>>2]|=(c|a)<<24-s%4*8,s++}return e.create(i,s)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(t){function e(t,e,r,n,i,s,o){return((t=t+(e&r|~e&n)+i+o)<<s|t>>>32-s)+e}function r(t,e,r,n,i,s,o){return((t=t+(e&n|r&~n)+i+o)<<s|t>>>32-s)+e}function n(t,e,r,n,i,s,o){return((t=t+(e^r^n)+i+o)<<s|t>>>32-s)+e}function i(t,e,r,n,i,s,o){return((t=t+(r^(e|~n))+i+o)<<s|t>>>32-s)+e}for(var s=CryptoJS,o=(a=s.lib).WordArray,c=a.Hasher,a=s.algo,f=[],h=0;64>h;h++)f[h]=4294967296*t.abs(t.sin(h+1))|0;a=a.MD5=c.extend({_doReset:function(){this._hash=new o.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,s){for(var o=0;16>o;o++){var c=t[a=s+o];t[a]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}o=this._hash.words;var a=t[s+0],h=(c=t[s+1],t[s+2]),u=t[s+3],p=t[s+4],d=t[s+5],l=t[s+6],y=t[s+7],_=t[s+8],g=t[s+9],v=t[s+10],m=t[s+11],B=t[s+12],S=t[s+13],x=t[s+14],k=t[s+15],C=e(C=o[0],E=o[1],z=o[2],w=o[3],a,7,f[0]),w=e(w,C,E,z,c,12,f[1]),z=e(z,w,C,E,h,17,f[2]),E=e(E,z,w,C,u,22,f[3]);C=e(C,E,z,w,p,7,f[4]),w=e(w,C,E,z,d,12,f[5]),z=e(z,w,C,E,l,17,f[6]),E=e(E,z,w,C,y,22,f[7]),C=e(C,E,z,w,_,7,f[8]),w=e(w,C,E,z,g,12,f[9]),z=e(z,w,C,E,v,17,f[10]),E=e(E,z,w,C,m,22,f[11]),C=e(C,E,z,w,B,7,f[12]),w=e(w,C,E,z,S,12,f[13]),z=e(z,w,C,E,x,17,f[14]),C=r(C,E=e(E,z,w,C,k,22,f[15]),z,w,c,5,f[16]),w=r(w,C,E,z,l,9,f[17]),z=r(z,w,C,E,m,14,f[18]),E=r(E,z,w,C,a,20,f[19]),C=r(C,E,z,w,d,5,f[20]),w=r(w,C,E,z,v,9,f[21]),z=r(z,w,C,E,k,14,f[22]),E=r(E,z,w,C,p,20,f[23]),C=r(C,E,z,w,g,5,f[24]),w=r(w,C,E,z,x,9,f[25]),z=r(z,w,C,E,u,14,f[26]),E=r(E,z,w,C,_,20,f[27]),C=r(C,E,z,w,S,5,f[28]),w=r(w,C,E,z,h,9,f[29]),z=r(z,w,C,E,y,14,f[30]),C=n(C,E=r(E,z,w,C,B,20,f[31]),z,w,d,4,f[32]),w=n(w,C,E,z,_,11,f[33]),z=n(z,w,C,E,m,16,f[34]),E=n(E,z,w,C,x,23,f[35]),C=n(C,E,z,w,c,4,f[36]),w=n(w,C,E,z,p,11,f[37]),z=n(z,w,C,E,y,16,f[38]),E=n(E,z,w,C,v,23,f[39]),C=n(C,E,z,w,S,4,f[40]),w=n(w,C,E,z,a,11,f[41]),z=n(z,w,C,E,u,16,f[42]),E=n(E,z,w,C,l,23,f[43]),C=n(C,E,z,w,g,4,f[44]),w=n(w,C,E,z,B,11,f[45]),z=n(z,w,C,E,k,16,f[46]),C=i(C,E=n(E,z,w,C,h,23,f[47]),z,w,a,6,f[48]),w=i(w,C,E,z,y,10,f[49]),z=i(z,w,C,E,x,15,f[50]),E=i(E,z,w,C,d,21,f[51]),C=i(C,E,z,w,B,6,f[52]),w=i(w,C,E,z,u,10,f[53]),z=i(z,w,C,E,v,15,f[54]),E=i(E,z,w,C,c,21,f[55]),C=i(C,E,z,w,_,6,f[56]),w=i(w,C,E,z,k,10,f[57]),z=i(z,w,C,E,l,15,f[58]),E=i(E,z,w,C,S,21,f[59]),C=i(C,E,z,w,p,6,f[60]),w=i(w,C,E,z,m,10,f[61]),z=i(z,w,C,E,h,15,f[62]),E=i(E,z,w,C,g,21,f[63]);o[0]=o[0]+C|0,o[1]=o[1]+E|0,o[2]=o[2]+z|0,o[3]=o[3]+w|0},_doFinalize:function(){var e=this._data,r=e.words,n=8*this._nDataBytes,i=8*e.sigBytes;r[i>>>5]|=128<<24-i%32;var s=t.floor(n/4294967296);for(r[15+(i+64>>>9<<4)]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),r[14+(i+64>>>9<<4)]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8),e.sigBytes=4*(r.length+1),this._process(),r=(e=this._hash).words,n=0;4>n;n++)i=r[n],r[n]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8);return e},clone:function(){var t=c.clone.call(this);return t._hash=this._hash.clone(),t}}),s.MD5=c._createHelper(a),s.HmacMD5=c._createHmacHelper(a)}(Math),function(){var t,e=CryptoJS,r=(t=e.lib).Base,n=t.WordArray,i=(t=e.algo).EvpKDF=r.extend({cfg:r.extend({keySize:4,hasher:t.MD5,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var r=(c=this.cfg).hasher.create(),i=n.create(),s=i.words,o=c.keySize,c=c.iterations;s.length<o;){a&&r.update(a);var a=r.update(t).finalize(e);r.reset();for(var f=1;f<c;f++)a=r.finalize(a),r.reset();i.concat(a)}return i.sigBytes=4*o,i}});e.EvpKDF=function(t,e,r){return i.create(r).compute(t,e)}}(),CryptoJS.lib.Cipher||function(t){var e=(d=CryptoJS).lib,r=e.Base,n=e.WordArray,i=e.BufferedBlockAlgorithm,s=d.enc.Base64,o=d.algo.EvpKDF,c=e.Cipher=i.extend({cfg:r.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,r){this.cfg=this.cfg.extend(r),this._xformMode=t,this._key=e,this.reset()},reset:function(){i.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(t){return{encrypt:function(e,r,n){return("string"==typeof r?l:p).encrypt(t,e,r,n)},decrypt:function(e,r,n){return("string"==typeof r?l:p).decrypt(t,e,r,n)}}}});e.StreamCipher=c.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var a=d.mode={},f=function(t,e,r){var n=this._iv;n?this._iv=undefined:n=this._prevBlock;for(var i=0;i<r;i++)t[e+i]^=n[i]},h=(e.BlockCipherMode=r.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}})).extend();h.Encryptor=h.extend({processBlock:function(t,e){var r=this._cipher,n=r.blockSize;f.call(this,t,e,n),r.encryptBlock(t,e),this._prevBlock=t.slice(e,e+n)}}),h.Decryptor=h.extend({processBlock:function(t,e){var r=this._cipher,n=r.blockSize,i=t.slice(e,e+n);r.decryptBlock(t,e),f.call(this,t,e,n),this._prevBlock=i}}),a=a.CBC=h,h=(d.pad={}).Pkcs7={pad:function(t,e){for(var r,i=(r=(r=4*e)-t.sigBytes%r)<<24|r<<16|r<<8|r,s=[],o=0;o<r;o+=4)s.push(i);r=n.create(s,r),t.concat(r)},unpad:function(t){t.sigBytes-=255&t.words[t.sigBytes-1>>>2]}},e.BlockCipher=c.extend({cfg:c.cfg.extend({mode:a,padding:h}),reset:function(){c.reset.call(this);var t=(e=this.cfg).iv,e=e.mode;if(this._xformMode==this._ENC_XFORM_MODE)var r=e.createEncryptor;else r=e.createDecryptor,this._minBufferSize=1;this._mode=r.call(e,this,t&&t.words)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){t.pad(this._data,this.blockSize);var e=this._process(!0)}else e=this._process(!0),t.unpad(e);return e},blockSize:4});var u=e.CipherParams=r.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}}),p=(a=(d.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext;return((t=t.salt)?n.create([1398893684,1701076831]).concat(t).concat(e):e).toString(s)},parse:function(t){var e=(t=s.parse(t)).words;if(1398893684==e[0]&&1701076831==e[1]){var r=n.create(e.slice(2,4));e.splice(0,4),t.sigBytes-=16}return u.create({ciphertext:t,salt:r})}},e.SerializableCipher=r.extend({cfg:r.extend({format:a}),encrypt:function(t,e,r,n){n=this.cfg.extend(n);var i=t.createEncryptor(r,n);return e=i.finalize(e),i=i.cfg,u.create({ciphertext:e,key:r,iv:i.iv,algorithm:t,mode:i.mode,padding:i.padding,blockSize:t.blockSize,formatter:n.format})},decrypt:function(t,e,r,n){return n=this.cfg.extend(n),e=this._parse(e,n.format),t.createDecryptor(r,n).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}})),d=(d.kdf={}).OpenSSL={execute:function(t,e,r,i){return i||(i=n.random(8)),t=o.create({keySize:e+r}).compute(t,i),r=n.create(t.words.slice(e),4*r),t.sigBytes=4*e,u.create({key:t,iv:r,salt:i})}},l=e.PasswordBasedCipher=p.extend({cfg:p.cfg.extend({kdf:d}),encrypt:function(t,e,r,n){return r=(n=this.cfg.extend(n)).kdf.execute(r,t.keySize,t.ivSize),n.iv=r.iv,(t=p.encrypt.call(this,t,e,r.key,n)).mixIn(r),t},decrypt:function(t,e,r,n){return n=this.cfg.extend(n),e=this._parse(e,n.format),r=n.kdf.execute(r,t.keySize,t.ivSize,e.salt),n.iv=r.iv,p.decrypt.call(this,t,e,r.key,n)}})}(),function(){for(var t=CryptoJS,e=t.lib.BlockCipher,r=t.algo,n=[],i=[],s=[],o=[],c=[],a=[],f=[],h=[],u=[],p=[],d=[],l=0;256>l;l++)d[l]=128>l?l<<1:l<<1^283;var y=0,_=0;for(l=0;256>l;l++){var g=(g=_^_<<1^_<<2^_<<3^_<<4)>>>8^255&g^99;n[y]=g,i[g]=y;var v=d[y],m=d[v],B=d[m],S=257*d[g]^16843008*g;s[y]=S<<24|S>>>8,o[y]=S<<16|S>>>16,c[y]=S<<8|S>>>24,a[y]=S,S=16843009*B^65537*m^257*v^16843008*y,f[g]=S<<24|S>>>8,h[g]=S<<16|S>>>16,u[g]=S<<8|S>>>24,p[g]=S,y?(y=v^d[d[d[B^v]]],_^=d[d[_]]):y=_=1}var x=[0,1,2,4,8,16,32,64,128,27,54];r=r.AES=e.extend({_doReset:function(){for(var t=(r=this._key).words,e=r.sigBytes/4,r=4*((this._nRounds=e+6)+1),i=this._keySchedule=[],s=0;s<r;s++)if(s<e)i[s]=t[s];else{var o=i[s-1];s%e?6<e&&4==s%e&&(o=n[o>>>24]<<24|n[o>>>16&255]<<16|n[o>>>8&255]<<8|n[255&o]):(o=n[(o=o<<8|o>>>24)>>>24]<<24|n[o>>>16&255]<<16|n[o>>>8&255]<<8|n[255&o],o^=x[s/e|0]<<24),i[s]=i[s-e]^o}for(t=this._invKeySchedule=[],e=0;e<r;e++)s=r-e,o=e%4?i[s]:i[s-4],t[e]=4>e||4>=s?o:f[n[o>>>24]]^h[n[o>>>16&255]]^u[n[o>>>8&255]]^p[n[255&o]]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,s,o,c,a,n)},decryptBlock:function(t,e){var r=t[e+1];t[e+1]=t[e+3],t[e+3]=r,this._doCryptBlock(t,e,this._invKeySchedule,f,h,u,p,i),r=t[e+1],t[e+1]=t[e+3],t[e+3]=r},_doCryptBlock:function(t,e,r,n,i,s,o,c){for(var a=this._nRounds,f=t[e]^r[0],h=t[e+1]^r[1],u=t[e+2]^r[2],p=t[e+3]^r[3],d=4,l=1;l<a;l++){var y=n[f>>>24]^i[h>>>16&255]^s[u>>>8&255]^o[255&p]^r[d++],_=n[h>>>24]^i[u>>>16&255]^s[p>>>8&255]^o[255&f]^r[d++],g=n[u>>>24]^i[p>>>16&255]^s[f>>>8&255]^o[255&h]^r[d++];p=n[p>>>24]^i[f>>>16&255]^s[h>>>8&255]^o[255&u]^r[d++],f=y,h=_,u=g}y=(c[f>>>24]<<24|c[h>>>16&255]<<16|c[u>>>8&255]<<8|c[255&p])^r[d++],_=(c[h>>>24]<<24|c[u>>>16&255]<<16|c[p>>>8&255]<<8|c[255&f])^r[d++],g=(c[u>>>24]<<24|c[p>>>16&255]<<16|c[f>>>8&255]<<8|c[255&h])^r[d++],p=(c[p>>>24]<<24|c[f>>>16&255]<<16|c[h>>>8&255]<<8|c[255&u])^r[d++],t[e]=y,t[e+1]=_,t[e+2]=g,t[e+3]=p},keySize:8});t.AES=e._createHelper(r)}();const knownPrefix="DECRYPTED_MESSAGE:";let success=!1;function decrypt(t){try{const e=document.getElementById("encrypted-content").innerHTML,r=CryptoJS.AES.decrypt(e,t).toString(CryptoJS.enc.Utf8);if(r.startsWith(knownPrefix)&&!success){success=!0;const t=r.substring(knownPrefix.length);document.getElementById("encrypted-content").style.display="none",typeOutMessage(t)}}catch(t){}}function typeOutMessage(t,e=35){const r=document.getElementById("decrypted-content");let n=0;!function i(){const s=document.createElement("span");s.className="fade-in",s.textContent=t.charAt(n),r.appendChild(s),n++,n<t.length&&setTimeout(i,e)}()}function tryDecrypt(){decrypt(document.getElementById("password").value)}document.getElementById("password").addEventListener("keyup",tryDecrypt)</script>
  </body>
  </html>
  `
}

function template(message:string) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enter Password</title>
      <style>
        * {
            box-sizing: border-box;
        }
        body {
            font-family: monospace;
            background-color: #f0f0f0;
            color: #333;
            margin: 0;
            padding: 0;
        }
        #container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            text-align: center;
            padding: 16px;
        }
        #content {
            padding: 20px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        #password {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #aaa;
            border-radius: 4px;
            font-family: monospace;
        }
        #decrypted-content, #encrypted-content{
            white-space: pre-wrap;
            margin: 1em 0;
            text-align: left;
            font-size: 14px;
            transition: opacity 0.5s ease;
            overflow-wrap: break-word;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .fade-in {
          animation: fadeIn 0.25s ease-in-out;
        }
    </style>
  </head>
  <body>
        <div id="container">
            <div id="content">
                <p>Enter password to decrypt message</p>
                <input placeholder="Enter password" type="password" id="password" />
                <div id="decrypted-content"></div>
                <div id="encrypted-content">${message}</div>
            </div>
        </div>
        
        
      <script>
var CryptoJS=CryptoJS||function(u,p){var d={},l=d.lib={},s=function(){},t=l.Base={extend:function(a){s.prototype=this;var c=new s;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
r=l.WordArray=t.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=p?c:4*a.length},toString:function(a){return(a||v).stringify(this)},concat:function(a){var c=this.words,e=a.words,j=this.sigBytes;a=a.sigBytes;this.clamp();if(j%4)for(var k=0;k<a;k++)c[j+k>>>2]|=(e[k>>>2]>>>24-8*(k%4)&255)<<24-8*((j+k)%4);else if(65535<e.length)for(k=0;k<a;k+=4)c[j+k>>>2]=e[k>>>2];else c.push.apply(c,e);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=u.ceil(c/4)},clone:function(){var a=t.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],e=0;e<a;e+=4)c.push(4294967296*u.random()|0);return new r.init(c,a)}}),w=d.enc={},v=w.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++){var k=c[j>>>2]>>>24-8*(j%4)&255;e.push((k>>>4).toString(16));e.push((k&15).toString(16))}return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j+=2)e[j>>>3]|=parseInt(a.substr(j,
2),16)<<24-4*(j%8);return new r.init(e,c/2)}},b=w.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var e=[],j=0;j<a;j++)e.push(String.fromCharCode(c[j>>>2]>>>24-8*(j%4)&255));return e.join("")},parse:function(a){for(var c=a.length,e=[],j=0;j<c;j++)e[j>>>2]|=(a.charCodeAt(j)&255)<<24-8*(j%4);return new r.init(e,c)}},x=w.Utf8={stringify:function(a){try{return decodeURIComponent(escape(b.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return b.parse(unescape(encodeURIComponent(a)))}},
q=l.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new r.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=x.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,e=c.words,j=c.sigBytes,k=this.blockSize,b=j/(4*k),b=a?u.ceil(b):u.max((b|0)-this._minBufferSize,0);a=b*k;j=u.min(4*a,j);if(a){for(var q=0;q<a;q+=k)this._doProcessBlock(e,q);q=e.splice(0,a);c.sigBytes-=j}return new r.init(q,j)},clone:function(){var a=t.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});l.Hasher=q.extend({cfg:t.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){q.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,e){return(new a.init(e)).finalize(b)}},_createHmacHelper:function(a){return function(b,e){return(new n.HMAC.init(a,
e)).finalize(b)}}});var n=d.algo={};return d}(Math);
(function(){var u=CryptoJS,p=u.lib.WordArray;u.enc.Base64={stringify:function(d){var l=d.words,p=d.sigBytes,t=this._map;d.clamp();d=[];for(var r=0;r<p;r+=3)for(var w=(l[r>>>2]>>>24-8*(r%4)&255)<<16|(l[r+1>>>2]>>>24-8*((r+1)%4)&255)<<8|l[r+2>>>2]>>>24-8*((r+2)%4)&255,v=0;4>v&&r+0.75*v<p;v++)d.push(t.charAt(w>>>6*(3-v)&63));if(l=t.charAt(64))for(;d.length%4;)d.push(l);return d.join("")},parse:function(d){var l=d.length,s=this._map,t=s.charAt(64);t&&(t=d.indexOf(t),-1!=t&&(l=t));for(var t=[],r=0,w=0;w<
l;w++)if(w%4){var v=s.indexOf(d.charAt(w-1))<<2*(w%4),b=s.indexOf(d.charAt(w))>>>6-2*(w%4);t[r>>>2]|=(v|b)<<24-8*(r%4);r++}return p.create(t,r)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
(function(u){function p(b,n,a,c,e,j,k){b=b+(n&a|~n&c)+e+k;return(b<<j|b>>>32-j)+n}function d(b,n,a,c,e,j,k){b=b+(n&c|a&~c)+e+k;return(b<<j|b>>>32-j)+n}function l(b,n,a,c,e,j,k){b=b+(n^a^c)+e+k;return(b<<j|b>>>32-j)+n}function s(b,n,a,c,e,j,k){b=b+(a^(n|~c))+e+k;return(b<<j|b>>>32-j)+n}for(var t=CryptoJS,r=t.lib,w=r.WordArray,v=r.Hasher,r=t.algo,b=[],x=0;64>x;x++)b[x]=4294967296*u.abs(u.sin(x+1))|0;r=r.MD5=v.extend({_doReset:function(){this._hash=new w.init([1732584193,4023233417,2562383102,271733878])},
_doProcessBlock:function(q,n){for(var a=0;16>a;a++){var c=n+a,e=q[c];q[c]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360}var a=this._hash.words,c=q[n+0],e=q[n+1],j=q[n+2],k=q[n+3],z=q[n+4],r=q[n+5],t=q[n+6],w=q[n+7],v=q[n+8],A=q[n+9],B=q[n+10],C=q[n+11],u=q[n+12],D=q[n+13],E=q[n+14],x=q[n+15],f=a[0],m=a[1],g=a[2],h=a[3],f=p(f,m,g,h,c,7,b[0]),h=p(h,f,m,g,e,12,b[1]),g=p(g,h,f,m,j,17,b[2]),m=p(m,g,h,f,k,22,b[3]),f=p(f,m,g,h,z,7,b[4]),h=p(h,f,m,g,r,12,b[5]),g=p(g,h,f,m,t,17,b[6]),m=p(m,g,h,f,w,22,b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
E,15,b[50]),m=s(m,g,h,f,r,21,b[51]),f=s(f,m,g,h,u,6,b[52]),h=s(h,f,m,g,k,10,b[53]),g=s(g,h,f,m,B,15,b[54]),m=s(m,g,h,f,e,21,b[55]),f=s(f,m,g,h,v,6,b[56]),h=s(h,f,m,g,x,10,b[57]),g=s(g,h,f,m,t,15,b[58]),m=s(m,g,h,f,D,21,b[59]),f=s(f,m,g,h,z,6,b[60]),h=s(h,f,m,g,C,10,b[61]),g=s(g,h,f,m,j,15,b[62]),m=s(m,g,h,f,A,21,b[63]);a[0]=a[0]+f|0;a[1]=a[1]+m|0;a[2]=a[2]+g|0;a[3]=a[3]+h|0},_doFinalize:function(){var b=this._data,n=b.words,a=8*this._nDataBytes,c=8*b.sigBytes;n[c>>>5]|=128<<24-c%32;var e=u.floor(a/
4294967296);n[(c+64>>>9<<4)+15]=(e<<8|e>>>24)&16711935|(e<<24|e>>>8)&4278255360;n[(c+64>>>9<<4)+14]=(a<<8|a>>>24)&16711935|(a<<24|a>>>8)&4278255360;b.sigBytes=4*(n.length+1);this._process();b=this._hash;n=b.words;for(a=0;4>a;a++)c=n[a],n[a]=(c<<8|c>>>24)&16711935|(c<<24|c>>>8)&4278255360;return b},clone:function(){var b=v.clone.call(this);b._hash=this._hash.clone();return b}});t.MD5=v._createHelper(r);t.HmacMD5=v._createHmacHelper(r)})(Math);
(function(){var u=CryptoJS,p=u.lib,d=p.Base,l=p.WordArray,p=u.algo,s=p.EvpKDF=d.extend({cfg:d.extend({keySize:4,hasher:p.MD5,iterations:1}),init:function(d){this.cfg=this.cfg.extend(d)},compute:function(d,r){for(var p=this.cfg,s=p.hasher.create(),b=l.create(),u=b.words,q=p.keySize,p=p.iterations;u.length<q;){n&&s.update(n);var n=s.update(d).finalize(r);s.reset();for(var a=1;a<p;a++)n=s.finalize(n),s.reset();b.concat(n)}b.sigBytes=4*q;return b}});u.EvpKDF=function(d,l,p){return s.create(p).compute(d,
l)}})();
CryptoJS.lib.Cipher||function(u){var p=CryptoJS,d=p.lib,l=d.Base,s=d.WordArray,t=d.BufferedBlockAlgorithm,r=p.enc.Base64,w=p.algo.EvpKDF,v=d.Cipher=t.extend({cfg:l.extend(),createEncryptor:function(e,a){return this.create(this._ENC_XFORM_MODE,e,a)},createDecryptor:function(e,a){return this.create(this._DEC_XFORM_MODE,e,a)},init:function(e,a,b){this.cfg=this.cfg.extend(b);this._xformMode=e;this._key=a;this.reset()},reset:function(){t.reset.call(this);this._doReset()},process:function(e){this._append(e);return this._process()},
finalize:function(e){e&&this._append(e);return this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(e){return{encrypt:function(b,k,d){return("string"==typeof k?c:a).encrypt(e,b,k,d)},decrypt:function(b,k,d){return("string"==typeof k?c:a).decrypt(e,b,k,d)}}}});d.StreamCipher=v.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var b=p.mode={},x=function(e,a,b){var c=this._iv;c?this._iv=u:c=this._prevBlock;for(var d=0;d<b;d++)e[a+d]^=
c[d]},q=(d.BlockCipherMode=l.extend({createEncryptor:function(e,a){return this.Encryptor.create(e,a)},createDecryptor:function(e,a){return this.Decryptor.create(e,a)},init:function(e,a){this._cipher=e;this._iv=a}})).extend();q.Encryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize;x.call(this,e,a,c);b.encryptBlock(e,a);this._prevBlock=e.slice(a,a+c)}});q.Decryptor=q.extend({processBlock:function(e,a){var b=this._cipher,c=b.blockSize,d=e.slice(a,a+c);b.decryptBlock(e,a);x.call(this,
e,a,c);this._prevBlock=d}});b=b.CBC=q;q=(p.pad={}).Pkcs7={pad:function(a,b){for(var c=4*b,c=c-a.sigBytes%c,d=c<<24|c<<16|c<<8|c,l=[],n=0;n<c;n+=4)l.push(d);c=s.create(l,c);a.concat(c)},unpad:function(a){a.sigBytes-=a.words[a.sigBytes-1>>>2]&255}};d.BlockCipher=v.extend({cfg:v.cfg.extend({mode:b,padding:q}),reset:function(){v.reset.call(this);var a=this.cfg,b=a.iv,a=a.mode;if(this._xformMode==this._ENC_XFORM_MODE)var c=a.createEncryptor;else c=a.createDecryptor,this._minBufferSize=1;this._mode=c.call(a,
this,b&&b.words)},_doProcessBlock:function(a,b){this._mode.processBlock(a,b)},_doFinalize:function(){var a=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){a.pad(this._data,this.blockSize);var b=this._process(!0)}else b=this._process(!0),a.unpad(b);return b},blockSize:4});var n=d.CipherParams=l.extend({init:function(a){this.mixIn(a)},toString:function(a){return(a||this.formatter).stringify(this)}}),b=(p.format={}).OpenSSL={stringify:function(a){var b=a.ciphertext;a=a.salt;return(a?s.create([1398893684,
1701076831]).concat(a).concat(b):b).toString(r)},parse:function(a){a=r.parse(a);var b=a.words;if(1398893684==b[0]&&1701076831==b[1]){var c=s.create(b.slice(2,4));b.splice(0,4);a.sigBytes-=16}return n.create({ciphertext:a,salt:c})}},a=d.SerializableCipher=l.extend({cfg:l.extend({format:b}),encrypt:function(a,b,c,d){d=this.cfg.extend(d);var l=a.createEncryptor(c,d);b=l.finalize(b);l=l.cfg;return n.create({ciphertext:b,key:c,iv:l.iv,algorithm:a,mode:l.mode,padding:l.padding,blockSize:a.blockSize,formatter:d.format})},
decrypt:function(a,b,c,d){d=this.cfg.extend(d);b=this._parse(b,d.format);return a.createDecryptor(c,d).finalize(b.ciphertext)},_parse:function(a,b){return"string"==typeof a?b.parse(a,this):a}}),p=(p.kdf={}).OpenSSL={execute:function(a,b,c,d){d||(d=s.random(8));a=w.create({keySize:b+c}).compute(a,d);c=s.create(a.words.slice(b),4*c);a.sigBytes=4*b;return n.create({key:a,iv:c,salt:d})}},c=d.PasswordBasedCipher=a.extend({cfg:a.cfg.extend({kdf:p}),encrypt:function(b,c,d,l){l=this.cfg.extend(l);d=l.kdf.execute(d,
b.keySize,b.ivSize);l.iv=d.iv;b=a.encrypt.call(this,b,c,d.key,l);b.mixIn(d);return b},decrypt:function(b,c,d,l){l=this.cfg.extend(l);c=this._parse(c,l.format);d=l.kdf.execute(d,b.keySize,b.ivSize,c.salt);l.iv=d.iv;return a.decrypt.call(this,b,c,d.key,l)}})}();
(function(){for(var u=CryptoJS,p=u.lib.BlockCipher,d=u.algo,l=[],s=[],t=[],r=[],w=[],v=[],b=[],x=[],q=[],n=[],a=[],c=0;256>c;c++)a[c]=128>c?c<<1:c<<1^283;for(var e=0,j=0,c=0;256>c;c++){var k=j^j<<1^j<<2^j<<3^j<<4,k=k>>>8^k&255^99;l[e]=k;s[k]=e;var z=a[e],F=a[z],G=a[F],y=257*a[k]^16843008*k;t[e]=y<<24|y>>>8;r[e]=y<<16|y>>>16;w[e]=y<<8|y>>>24;v[e]=y;y=16843009*G^65537*F^257*z^16843008*e;b[k]=y<<24|y>>>8;x[k]=y<<16|y>>>16;q[k]=y<<8|y>>>24;n[k]=y;e?(e=z^a[a[a[G^z]]],j^=a[a[j]]):e=j=1}var H=[0,1,2,4,8,
16,32,64,128,27,54],d=d.AES=p.extend({_doReset:function(){for(var a=this._key,c=a.words,d=a.sigBytes/4,a=4*((this._nRounds=d+6)+1),e=this._keySchedule=[],j=0;j<a;j++)if(j<d)e[j]=c[j];else{var k=e[j-1];j%d?6<d&&4==j%d&&(k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255]):(k=k<<8|k>>>24,k=l[k>>>24]<<24|l[k>>>16&255]<<16|l[k>>>8&255]<<8|l[k&255],k^=H[j/d|0]<<24);e[j]=e[j-d]^k}c=this._invKeySchedule=[];for(d=0;d<a;d++)j=a-d,k=d%4?e[j]:e[j-4],c[d]=4>d||4>=j?k:b[l[k>>>24]]^x[l[k>>>16&255]]^q[l[k>>>
8&255]]^n[l[k&255]]},encryptBlock:function(a,b){this._doCryptBlock(a,b,this._keySchedule,t,r,w,v,l)},decryptBlock:function(a,c){var d=a[c+1];a[c+1]=a[c+3];a[c+3]=d;this._doCryptBlock(a,c,this._invKeySchedule,b,x,q,n,s);d=a[c+1];a[c+1]=a[c+3];a[c+3]=d},_doCryptBlock:function(a,b,c,d,e,j,l,f){for(var m=this._nRounds,g=a[b]^c[0],h=a[b+1]^c[1],k=a[b+2]^c[2],n=a[b+3]^c[3],p=4,r=1;r<m;r++)var q=d[g>>>24]^e[h>>>16&255]^j[k>>>8&255]^l[n&255]^c[p++],s=d[h>>>24]^e[k>>>16&255]^j[n>>>8&255]^l[g&255]^c[p++],t=
d[k>>>24]^e[n>>>16&255]^j[g>>>8&255]^l[h&255]^c[p++],n=d[n>>>24]^e[g>>>16&255]^j[h>>>8&255]^l[k&255]^c[p++],g=q,h=s,k=t;q=(f[g>>>24]<<24|f[h>>>16&255]<<16|f[k>>>8&255]<<8|f[n&255])^c[p++];s=(f[h>>>24]<<24|f[k>>>16&255]<<16|f[n>>>8&255]<<8|f[g&255])^c[p++];t=(f[k>>>24]<<24|f[n>>>16&255]<<16|f[g>>>8&255]<<8|f[h&255])^c[p++];n=(f[n>>>24]<<24|f[g>>>16&255]<<16|f[h>>>8&255]<<8|f[k&255])^c[p++];a[b]=q;a[b+1]=s;a[b+2]=t;a[b+3]=n},keySize:8});u.AES=p._createHelper(d)})();
        const knownPrefix = "DECRYPTED_MESSAGE:"
        let success = false;

        function decrypt(password) {
            try {
                const encryptedMessage = document.getElementById('encrypted-content').innerHTML
                const decrypted = CryptoJS.AES.decrypt(encryptedMessage, password);
                const decryptedMessageWithPrefix = decrypted.toString(CryptoJS.enc.Utf8);
                if (decryptedMessageWithPrefix.startsWith(knownPrefix) && !success) {
                  success = true
                  
                  const decryptedMessage = decryptedMessageWithPrefix.substring(knownPrefix.length);
                  // document.getElementById('decrypted-content').textContent = decryptedMessage;
                  document.getElementById('encrypted-content').style.display = 'none';
                  // document.getElementById('decrypted-content').style.opacity = '1';
                  typeOutMessage(decryptedMessage);
              }
            } catch (error) {
            }
        }
        
        function typeOutMessage(decryptedMessage, delay = 35) {
          const contentElement = document.getElementById('decrypted-content');
          let i = 0;
        
          function typeNextCharacter() {
            const charSpan = document.createElement('span');
            charSpan.className = 'fade-in';
            charSpan.textContent = decryptedMessage.charAt(i);
            contentElement.appendChild(charSpan);
            
            i++;
        
            if (i < decryptedMessage.length) {
              setTimeout(typeNextCharacter, delay);
            }
          }
        
          typeNextCharacter();
        }
        
        function tryDecrypt() {
            const password = document.getElementById('password').value;
        decrypt(password);
}
document.getElementById('password').addEventListener('keyup', tryDecrypt);
    </script>
  </body>
  </html>
  `
}