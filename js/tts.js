
function wordClass(word, path){
	this.ready = false;
	this.speaking = false;

	this.speak = function(when_done){ 
		this.when_done = when_done || function(){}; 
		this.speaking = true;
		if (this.ready == false){
			console.log("Error: word sound file for '"+word+"' could not be loaded");
			this.when_done();
			}
		this.player.play();
		};

	// Make player object
	var filename =  path + "/" + word.toLowerCase() + ".mp3";
	this.player = new Audio();

	var me = this;
	$(this.player).attr("src", filename);
	$(this.player).attr("preload", "auto");
	$(this.player).on("canplay", function(){ me.ready=true })
	// TBD	     .on("error", text2speech.handle_error)
		     .on("ended", function(){ me.speaking=false; me.when_done(); }  );
}

text2speech = {
	queue:[],
	player:null,
	words:{},
	spelling:{ '0':'zero', '1':'one', '2':'two', '3':'tree', '4':'fower', '5':'five',
	           '6':'six', '7':'seven', '8':'eight', '9':'niner',
		   'a':'alpha', 'b':'bravo', 'c':'charlie', 'd':'delta', 'e':'echo',
		   'f':'foxtrott', 'g':'golf', 'h':'hotel', 'i':'india', 'j':'juliett',
		   'k':'kilo', 'l':'lima', 'm':'mike', 'n':'november', 'o':'oscar',
		   'p':'papa', 'q':'quebec', 'r':'romeo', 's':'sierra', 't':'tango',
		   'u':'uniform', 'v':'victor', 'w':'whiskey', 'x':'x-ray', 'y':'yankee',
		   'z':'zulu'},
	playing:false,
	init:function(words,path){
		var words = words.toLowerCase().split(" ");
		for (var i in words){
			var word = words[i];
			text2speech.words[word] = new wordClass(word, path);
			}
		},
	play_next:function(){
		text2speech.playing=true;
		if (text2speech.queue.length==0){
			text2speech.player_finished();
			return;
			}
		var word = text2speech.queue.shift();
		console.log(word);
		word.speak(text2speech.play_next);
		},
	handle_error:function(evt){
		},
	player_finished:function(){
		text2speech.playing=false;
		},
	say:function(text){
		var i;
		var pieces = text.trim().replace(/ +/g," ").toLowerCase().split(/[, ]/);
		for (var i = 0; i<pieces.length; i++){
			var word = pieces[i];
			if (word in text2speech.words)
				text2speech.queue.push(text2speech.words[word]);
			else if (word.match(/^[0-9]+$/)){
				var numbers = word.split("");
				for (var i in numbers){
					console.log("numbers i="+i+" is '"+numbers[i]+"'");
					text2speech.queue.push(text2speech.words[text2speech.spelling[numbers[i]]]);
					}
				}
			else
				alert("Cannot say '"+word+"'");
		}
		if (!text2speech.playing){
			text2speech.play_next();
		}
	}
}

$(document).ready(function(){
 text2speech.init("before startup belts doors flaps qnh startup aileron alpha altimeter arm avionics off begin belts fastened brake set bravo charlie checklist checklists choke if needed cht close complete cowl flap decial delta departure disarm doors closed echo eight elevator fastened five fower foxtrott fuel pump fuel pump on full fuse fuses checked golf holding-point hotel hundred id idle ignition on india juliett kilo landing left lima magnet main switch on mike next niner normal november off oil pressue min oil pressure on one open oscar papa plane post pre prop area prop area free quebec radio rescue system arm rescue-system right romeo rpm rudder seat adjusted set seven shut-off valve shut-off valve open sierra six start starter pressed startup steps switch take-off tango taxi ten throttle tousand tree trim two type uniform victor whiskey x-ray yankee zulu . ;", "snd");
 });
