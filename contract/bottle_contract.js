"use strict";

var BottleItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
        this.id = obj.id;     
        this.author = obj.author;
        this.time = obj.time;
        this.message += obj.message;
	} else {
	    this.id = "";
	    this.author = "";
        this.time = "";
        this.message = ""
	}
};
BottleItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var MessageItem = function(text){
    if(text){
        var obj = JSON.parse(text);
        this.id = obj.id;
        this.author = obj.author;
        this.time = obj.time;
        this.value = obj.value;
        this.bottleId = obj.bottleId;
    }else{
        this.id = "";
        this.author = "";
        this.time = "";
        this.value = "";
        this.bottleId = "";
    }
};

MessageItem.prototype = {
    toString: function () {
		return JSON.stringify(this);
	}
}

var DriftingBottle = function () {
  
    LocalContractStorage.defineMapProperty(this, "bottles", {
        parse: function (text) {
            return new BottleItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    
   
    LocalContractStorage.defineMapProperty(this,"bottleIdMap");
    
    LocalContractStorage.defineProperty(this, "size");
    
    LocalContractStorage.defineMapProperty(this,"messages",{
        parse: function(text){
            return new MessageItem(text);
        },
        stringify: function(o){
            return o.toString();
        }
    })

};


DriftingBottle.prototype = {
    init() {
        this.size = 0;
    },

    sendBottle ( message ) {

        var index = this.size;

        message = message.trim();
        if ( message === ""){
            throw new Error("empty key / value");
        }
        if (message.length > 128){
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;

        //save bottle
        var bottleItem = new BottleItem();
        bottleItem.author = from;
        var bottleId = (Number(Math.random().toString().substr(2) + Date.now())/7).toString(36).slice(0,12);
        bottleItem.id = bottleId;
        var time = new Date().getTime();
        bottleItem.time = time;
        bottleItem.message = message;

        this.bottles.set(bottleId, bottleItem);
        this.bottleIdMap.set(index, bottleId);
        this.size +=1;


        //save message
        // var messageItem = new MessageItem();
        // messageItem.author = from;
        // var msgId = (Number(Math.random().toString().substr(2) + Date.now())/7).toString(36).slice(0,12);
        // messageItem.id = msgId;
        // messageItem.time = time;
        // messageItem.value = message;
        // messageItem.bottleId = bottleId;
        // this.messages.put(msgId,messageItem);
    },
  
    responseBottle(message,bottleId){
        // var messageItem = new MessageItem();
        // var from = Blockchain.transaction.from;
        // messageItem.author = from;
        // var msgId = (Number(Math.random().toString().substr(2) + Date.now())/7).toString(36).slice(0,12);
        // messageItem.id = msgId;
        // messageItem.time = time;
        // messageItem.value = message;
        // messageItem.bottleId = bottleId;
        // this.messages.put(msgId,messageItem);
        var bottle = this.bottles.get(bottleId);
        bottle = JSON.parse(bottle);
        bottle.message = bottle.message + "%_%" + message;
        this.bottles.set(bottleId,bottle);

    },
    len(){
        return this.size;
    },
    pickBottle(){
        var randomIndex = Math.floor(Math.random() * this.size);
        var bottleId = this.bottleIdMap.get(randomIndex);
        var bottle = this.bottles.get(bottleId);
        var len = this.len();
        return {
            bottle:bottle,
            size:len
        }
    }
};
module.exports = DriftingBottle;