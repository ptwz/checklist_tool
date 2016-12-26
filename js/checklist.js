
checklist = {
	struct:null,
	step:0,
	current:null,
	current_name:'',
	next:[],
	update_gui:function(){
		},
	init:function(checklist_structure){
		checklist.struct = checklist_structure;
		checklist.next = checklist.get_all();
		checklist.update_gui();
		},
	get_all:function(){
		// Returns a list of available checklists
		return(Object.keys(checklist.struct.checklists));
		},
	set_current:function(name){
		if (name in checklist.struct.checklists)
		{
			checklist.current=checklist.struct.checklists[name];

			// Kinda assertions on the format:
			if (! ("next" in checklist.current) ){
				console.log("WARNING: Missing next checklists in '"+name+'"');
				checklist.current.next = [];
			}
			checklist.next = checklist.current.next;

			checklist.current_name=name;
			checklist.step = 0;
			text2speech.say(checklist.current_name+" checklist begin")
			checklist.begin_step();
		} else
			alert("Invalid checklist chosen ('"+name+"')!");
		},
	begin_step:function(){
		checklist.check_text = checklist.current.steps[checklist.step];

		text2speech.say(checklist.check_text);
		checklist.update_gui();
		},
	finish_step:function(){
		if (checklist.current == null) 
			return;
		var max_step = checklist.current.steps.length;
		checklist.step += 1;
		if (checklist.step == max_step) {
			checklist.complete();
			return;
			}
		checklist.begin_step();
		},
	complete:function(){
		text2speech.say(checklist.current_name+" checklist complete");
		checklist.current = null;
		checklist.step = 0;
		checklist.update_gui();
		}
	}
