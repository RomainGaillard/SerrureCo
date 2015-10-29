/**
 * Created by Romain Gaillard on 29/10/2015.
 */


module.exports = {
    generateCode: function(id){
        var code = ""
        var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        var list = new Array(this.numberRandom(0,99),alphabet[this.numberRandom(0,26)],id,alphabet[this.numberRandom(0,26)]);

        while(list.length>0){
            var pos = this.numberRandom(0,list.length-1)
            code += list[pos];
            list.splice(pos,1);
        }
        return code;
    },
    numberRandom: function(min,max){
        return Math.floor((Math.random() * max) + min);
    }
};