var _image_editor_example = {
	CROP_WIDTH : 90,
	CROP_HEIGHT: 90,
	CROP_CANVAS_WIDTH : 400,
	CROP_CANVAS_HEIGHT : 200,
	IMAGE_URL : "",
	ready : function() {
		$("#edit-image-container").cropImageCenter({
			url : _image_editor_example.IMAGE_URL,
			crop_width : _image_editor_example.CROP_WIDTH,
			crop_height : _image_editor_example.CROP_HEIGHT,
			crop_canvas_width : _image_editor_example.CROP_CANVAS_WIDTH,
			crop_canvas_height : _image_editor_example.CROP_CANVAS_HEIGHT,
			crop_to_window : true,
			getDataUrl : function(response) {
				$("#edit-image-container").cropImageFixedWindow({
					url :_image_editor_example.IMAGE_URL,
					crop_width : response.crop_width,
					crop_height : response.crop_height,
					crop_window_top_x : response.crop_window_top_x,
					crop_window_top_y : response.crop_window_top_y,
					crop_canvas_width : _image_editor_example.CROP_CANVAS_WIDTH,
					crop_canvas_height : _image_editor_example.CROP_CANVAS_HEIGHT,
					image_dimensions : {
						'width' : response.image_width,
						'height' : response.image_height
					},
					resize_percentage : 6,
					show_slider : false,
					getDataUrl : function(resp) {
						console.log(resp);
						$("#image-to-save").attr("src",resp.dataUrl);
					},
					error : function(errors) {
					}
				});
			},
			error : function(errors) {
			}
		});
	}
}

$(document).ready(function(){
	_image_editor_example.ready();
});



