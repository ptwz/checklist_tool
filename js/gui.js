gui = {
	init:function(checklist){
		// Hook up UI
		gui.titlebar = $("#titlebar");
		gui.footer = $("#div-footer");
		gui.btn_checked = $("#btn-checked");
		gui.lst_checklist = $("#lst-checklist");
		gui.workbook = $("#page-workbook");
		gui.div_checklist_container = $("#div-checklist-container");

		gui.btn_checked.on("click", gui.on_click_checked);
		gui.lst_checklist.listview();
		// Hook into other stuff
		gui.checklist = checklist;
		checklist.update_gui = gui.update;
		// Show first frame
		gui.update();
		},
	update:function(){
		// Title bar creation
		if (gui.checklist.struct != null)
			var plane_id = gui.checklist.struct.plane.id;
		else
			var plane_id = "???";

		var title = gui.checklist.current_name + " Checklist - " + plane_id;
		
		if (!gui.checklist.is_complete){
			// Set text in current checklist item
			gui.btn_checked.show().height(gui.div_checklist_container.height()).text(checklist.check_text.replace(";","..."));
			gui.titlebar.text(title);
		} else {
			// If no checklist in progress or has finished, show
			// next choices
			gui.btn_checked.hide();
		}
		// Adjust height of workbook
		var checklist_height = $(window).height() - gui.footer.height()*2;
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
		if (active!=null){
			gui.div_checklist_container.animate({
				scrollTop: active.offset().top-gui.div_checklist_container.offset().top
		    	}, 1000);

		}
		// Next checklist selection in footer
		gui.footer.empty();
		for (var i in gui.checklist.next){
			var name = gui.checklist.next[i];
			var btn = $('<input type="button"></input>');
			gui.footer.append(btn);
			btn.button( { 'inline':true } );
			btn.attr('value',name);
			btn.on('click', {'name':name}, function(evt){
				gui.checklist.set_current(evt.data.name);
				});
			btn.button("refresh");
		}
	},
	on_click_checked:function(){
		gui.checklist.finish_step();
		},
}


