gui = {
	init:function(checklist){
		// Hook up UI
		gui.titlebar = $("#titlebar");
		gui.footer = $("#div-footer");
		// Hook into other stuff
		gui.checklist = checklist;
		checklist.update_gui = gui.update;
		gui.update();
		},
	update:function(){
		if (gui.checklist.struct != null)
			var plane_id = gui.checklist.struct.plane.id;
		else
			var plane_id = "???";

		var title = gui.checklist.current_name + " Checklist - " + plane_id;

		gui.titlebar.text(title);
		gui.footer.empty();

		for (var i in gui.checklist.next){
			var name = gui.checklist.next[i];
			var btn = $('<button></button>');
			gui.footer.append(btn);
			btn.button( { 'inline':true } );
			btn.text(name);
			btn.on('click', {'name':name}, function(evt){
				gui.checklist.set_current(evt.data.name);
				});
		}
	}
}
