gui_workbook = {
	init:function(checklist){
		// Hook up UI
		gui_workbook.titlebar = $("#titlebar");
		gui_workbook.footer = $("#div-footer");
		gui_workbook.btn_checked = $("#btn-checked");
		gui_workbook.lst_checklist = $("#lst-checklist");
		gui_workbook.workbook = $("#page-workbook");
		gui_workbook.div_checklist_container = $("#div-checklist-container");

		gui_workbook.btn_checked.on("click", gui_workbook.on_click_checked);
		gui_workbook.lst_checklist.listview();
		// Hook into other stuff
		gui_workbook.checklist = checklist;
		checklist.update_gui = gui_workbook.update;
		// Show first frame
		gui_workbook.update();
		},
	update:function(){
		// Title bar creation
		if (gui_workbook.checklist.struct != null)
			var plane_id = gui_workbook.checklist.struct.plane.id;
		else
			var plane_id = "???";

		var title = gui_workbook.checklist.current_name + " Checklist - " + plane_id;
		
		if (!gui_workbook.checklist.is_complete){
			// Set text in current checklist item
			gui_workbook.btn_checked.show().height(gui_workbook.div_checklist_container.height()).text(checklist.check_text.replace(";","..."));
			gui_workbook.titlebar.text(title);
		} else {
			// If no checklist in progress or has finished, show
			// next choices
			gui_workbook.btn_checked.hide();
		}
		// Adjust height of workbook
		var checklist_height = $(window).height() - gui_workbook.footer.height()*2;
		console.log(checklist_height);
		gui_workbook.div_checklist_container.height(checklist_height);

		// Visualize current checklist
		gui_workbook.lst_checklist.empty();
		var steps = gui_workbook.checklist.get_current_list();
		var active = null;
		for (var i in steps){
			var element = $('<li class="ui-btn ui-btn-icon-right"></li>');
			element.text(steps[i]);
			if (i < gui_workbook.checklist.step)
				element.addClass("ui-icon-check");
			else if (i == gui_workbook.checklist.step) {
				element.addClass("ui-icon-eye");
				active = element;
			}

			gui_workbook.lst_checklist.append(element);
		}
		gui_workbook.lst_checklist.listview("refresh");
		if (active!=null){
			gui_workbook.div_checklist_container.animate({
				scrollTop: active.offset().top-gui_workbook.div_checklist_container.offset().top
		    	}, 1000);

		}
		// Next checklist selection in footer
		gui_workbook.footer.empty();
		for (var i in gui_workbook.checklist.next){
			var name = gui_workbook.checklist.next[i];
			var btn = $('<input type="button"></input>');
			gui_workbook.footer.append(btn);
			btn.button( { 'inline':true } );
			btn.attr('value',name);
			btn.on('click', {'name':name}, function(evt){
				gui_workbook.checklist.set_current(evt.data.name);
				});
			btn.button("refresh");
		}
	},
	on_click_checked:function(){
		gui_workbook.checklist.finish_step();
		},
}


gui_editor = {
	empty_checklist:{
		"plane":{
			"type":"",
			"id":""
			},
		"checklists":{
			}
		},
	current_checklist:null, // References to the current checklist to be edited, key into 
				// gui_editor.raw_checklist.checklists object
	edit_step:null, // Reference to the current checklists step to be edited (if any)
	_inputfield:null, // Stores the input element for editing
	init:function(raw_checklist){
		// Hook up UI
		//gui_editor.titlebar = $("#titlebar");
		//gui_editor.footer = $("#div-footer");
		gui_editor.editor = $("#page-editor");

		gui_editor.lst_edit_checklist_items = $("#lst-edit-checklist-items");
		gui_editor.lst_edit_checklist_items.listview();

		gui_editor.lst_nexts = $("#lst-edit-checklists-nexts");
		gui_editor.lst_nexts.listview();

		gui_editor.lst_all_checklists = $("#lst-all-checklists");
		gui_editor.lst_all_checklists.listview();


		// Hook into other stuff
		gui_editor.raw_checklist = raw_checklist || gui_editor.empty_checklist;
		// Show first frame
		gui_editor.update();

		//gui_editor.checklist.set_current("Startup");
		},
	 on_select_checklist:function(name){
		gui_editor.end_edit();
	 	gui_editor.current_checklist = name;
		gui_editor.update();
		console.log("Selected "+name);
	 	},
	end_edit:function(){
		// Terminates current text editing process.
		// NOTE: edit_step and current_checklist must be consistent!
		var inp = gui_editor._inputfield;
		if (gui_editor.edit_step != null){
			gui_editor._cl().steps[gui_editor.edit_step] = inp.attr("value");
			gui_editor.edit_step = null;
			gui_editor._inputfield = null;
			gui_editor.update();
		}
	},
	 _cl:function(){
	 	// Shorthand for current checklist object
	 	return gui_editor.raw_checklist.checklists[gui_editor.current_checklist]
		},
	 update:function(){
	 	// Fix checklist viewer height
		var checklist_height = $(window).height(); // - gui_editor.footer.height()*2;
		gui_editor.lst_edit_checklist_items.height(checklist_height);

		// Show selection of checklists
		gui_editor.lst_all_checklists.empty();
		var checklists = gui_editor.raw_checklist.checklists;
		for (var i in checklists){
			var element = $('<li class="ui-btn ui-btn-icon-right"></li>');
			element.text(i);
			element.on("click", {'name':i}, function(evt){
				gui_editor.on_select_checklist(evt.data.name);
				});
			console.log(i+"?="+gui_editor.current_checklist);
			if (i == gui_editor.current_checklist)
				element.addClass("down");
			gui_editor.lst_all_checklists.append(element);
		}
		gui_editor.lst_all_checklists.listview("refresh");

		// Visualize currently selected checklist
		gui_editor.lst_edit_checklist_items.empty();
		if (gui_editor.current_checklist == null)
			var steps = [];
		else
			var steps = gui_editor._cl().steps;

		var active = null;
		for (var i in steps){
			var element = $('<li class="ui-btn ui-btn-icon-right"></li>');
			if (gui_editor.edit_step==i){
				var inp = $('<input type="text">').attr("value", steps[i]);
				inp.on( "focusout", gui_editor.end_edit);
				inp.on( "keypress", function(evt){
					if (evt.key.toLowerCase()=="enter"){
						gui_editor.end_edit();
					}
					});
				gui_editor._inputfield = inp;

				window.setTimeout(function(){
					inp.focus();
					console.log("Focus!");
				}, 500);
				element.append(inp);
			} else
				element.text(steps[i]);
			// Edit text on dblclick
			element.on("dblclick", {i:i}, function(evt){
				gui_editor.end_edit();
				gui_editor.edit_step = evt.data.i;
				gui_editor.update();
				});
			gui_editor.lst_edit_checklist_items.append(element);
			console.log(steps[i]);
			}

		gui_editor.lst_edit_checklist_items
			.sortable()
			.disableSelection()
			.bind( "sortstop", function(event, ui) {
			      var lst = gui_editor.lst_edit_checklist_items;
			      lst.listview('refresh');

			      var step_items = $("li", lst);
			      var new_steps = [];
			      for (var i in step_items){
			      	new_steps.push(step_items[i].textContent);
			      }
			      gui_editor._cl().steps = new_steps;
			  });
		gui_editor.lst_edit_checklist_items.listview("refresh");
		}
	};
