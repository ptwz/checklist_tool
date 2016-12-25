
checklist = {
	struct:null,
	step:0,
	current:null,
	update_gui:function(){
		},
	init:function(checklist_structure){
		checklist.struct = checklist_structure;
		},
	get_all:function(){
		// Returns a list of available checklists
		return(Object.keys(checklist.struct.checklists));
		},
	set_current:function(name){
		if (name in checklist.struct.checklists)
		{
			checklist.current=checklist.struct.checklists[name];
			checklist.current_name=name;
			checklist.step = 0;
			text2speech.say(checklist.current_name+" checklist begin")
			checklist.begin_step();
		} else
			alert("Invalid checklist chosen!!");
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
