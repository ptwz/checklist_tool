gui = {
	init:function(checklist){
		// Hook up UI
		gui.titlebar = $("#titlebar");
		gui.footer = $("#div-footer");
		gui.btn_checked = $("#btn-checked");
		gui.lst_checklist = $("#lst-checklist");
		gui.workbook = $("#workbook");
		gui.div_checklist_container = $("#div-checklist-container");
		// Hook into other stuff
		gui.checklist = checklist;
		checklist.update_gui = gui.update;
		gui.update();
		},
	update:function(){
		// Title bar creation
		if (gui.checklist.struct != null)
			var plane_id = gui.checklist.struct.plane.id;
		else
			var plane_id = "???";

		var title = gui.checklist.current_name + " Checklist - " + plane_id;
		
		// Set text in current checklist item
		gui.btn_checked.text(checklist.check_text.replace(";","..."));
		gui.titlebar.text(title);

		// Adjust height of workbook
		var checklist_height = gui.workbook.innerHeight();
		console.log(checklist_height);
		gui.div_checklist_container.height(checklist_height);

		// Visualize current checklist
		gui.lst_checklist.empty();
		var steps = gui.checklist.get_current_list();
		var active = null;
		for (var i in steps){
			var element = $('<li class="ui-btn ui-btn-icon-right"></li>');
			element.text(steps[i]);
			if (i < gui.checklist.step)
				element.addClass("ui-icon-check");
			else if (i == gui.checklist.step) {
				element.addClass("ui-icon-eye");
				active = element;
			}

			gui.lst_checklist.append(element);
		}
		gui.lst_checklist.listview("refresh");
		if (active)
			active.attr("data-theme","b");
		// Next checklist selection in footer
		gui.footer.empty();
		for (var i in gui.checklist.next){
			var name = gui.checklist.next[i];
			var btn = $('<div></div>');
			gui.footer.append(btn);
			btn.button( { 'inline':true } );
			btn.text(name);
			btn.on('click', {'name':name}, function(evt){
				gui.checklist.set_current(evt.data.name);
				});
		}
	}
}
