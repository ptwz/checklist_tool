
function wordClass(word, path){
	this.ready = false;
	this.speaking = false;

	this.speak = function(when_done){ 
		this.when_done = when_done || function(){}; 
		this.speaking = true;
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
		     .on("ended", function(){ me.speaking=false; me.when_done(); console.log(me) ;}  );
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
		console.log("hier");
		if (text2speech.queue.length==0){
			text2speech.player_finished();
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
		var pieces = text.toLowerCase().split(/[, ]/);
		for (var i = 0; i<pieces.length; i++){
			var word = pieces[i];
			if (word in text2speech.words)
				text2speech.queue.push(text2speech.words[word]);
			else if (word.match(/^[0-9]+$/)){
				var numbers = word.split("");
				for (var i in numbers){
					text2speech.queue.push(text2speech.words[text2speech.spelling[numbers[i]]]);
					}
				}
		}
		if (text2speech.queue.length>0){
			text2speech.play_next();
		}
	}
}

function test(){
 text2speech.say("alpha bravo charlie");
}

$(document).ready(function(){
 $("#btn-test").on("click", test);
 text2speech.init("belts fastened brake set altimeter qnh shut-off valve ignition choke on off fuel pump prop area starter oil pressure normal radio trim cowl flap cht doors flaps open close throttle idle full one two tree fower five six seven eight niner ten hundred tousand decial alpha bravo charlie delta echo foxtrott golf hotel india juliett kilo lima mike november oscar papa quebec romeo sierra tango uniform victor whiskey x-ray yankee zulu magnet left right main switch fuses fuse rescue-system arm disarm fastened avionics rudder aileron elevator rpm taxi holding-point departure take-off landing post pre", "snd");
});
