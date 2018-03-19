var _image_editor = {
    image_url : "",
    ready : function() {
    },
    get_position : function(canvas, e) {
        var rect = canvas.getBoundingClientRect();
        var position =  {
            'x' : e.clientX - rect.left,
            'y' : e.clientY - rect.top
        };
        return position;
    },
    clear_canvas : function(canvas) {
        var width = $(canvas).width();
        var height = $(canvas).height();
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0, width, height);
    },
    drawImage : function(canvas, image) {
        var crop_canvas_ctx = canvas.getContext("2d");
        var image_top_x = (canvas.width- image.width)/2;
        var image_top_y = (canvas.height-image.height)/2;
        crop_canvas_ctx.drawImage(image, image_top_x ,image_top_y, image.width, image.height);
    },
    resetWindow : function(canvas, image, top_x, top_y, crop_width, crop_height) {
        var image_top_x = (canvas.width - image.width)/2;
        var image_top_y = (canvas.height - image.height)/2;
        var image_bottom_x = image_top_x + image.width;
        var image_bottom_y = image_top_y + image.height;
        var bottom_x = top_x + crop_width;
        var bottom_y = top_y + crop_height;
        top_x = (image_top_x>top_x)? image_top_x : top_x;
        top_y = (image_top_y>top_y)? image_top_y : top_y;
        top_x =  (image_bottom_x<bottom_x)? (top_x-(bottom_x-image_bottom_x)) : top_x;
        top_y = (image_bottom_y<bottom_y)?(top_y-(bottom_y-image_bottom_y)) : top_y;
        return {
            'top_x' : top_x,
            'top_y' : top_y
        };
    },
    drawFilledRectangle : function(canvas, top_x, top_y, width, height){
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle= "#fff";
        ctx.rect(top_x, top_y, width, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.globalAlpha = 0.5;
        ctx.rect(0, 0 , top_x, top_y);
        ctx.rect(top_x, 0, width, top_y);
        ctx.rect(top_x+width, 0, canvas.width-width-top_x, top_y);
        ctx.rect(0, top_y, top_x, height);
        ctx.rect(0, top_y+height, top_x, canvas.height-top_y-height);
        ctx.rect(top_x, top_y+height, width, canvas.height- top_y-height);
        ctx.rect(top_x+width, top_y+height, canvas.width-top_x-width, canvas.height-top_y-height);
        ctx.rect(top_x+width, top_y, canvas.width-top_x-width, height);
        ctx.fillStyle = "black";
        ctx.lineWidth = 0;
        ctx.fill();
        //ctx.stroke();
        ctx.globalAlpha = 1.0;
    },
    drawCroppedImage : function(crop_canvas, cropped_image_canvas, image, top_x, top_y, crop_width, crop_height, init_image_width, init_image_height) {
        var orig_window_width = (crop_width/image.width)*init_image_width;
        var orig_window_height = (crop_height/image.height)*init_image_height;
        var new_top_x = top_x-((crop_canvas.width-image.width)/2);
        var new_top_y = top_y-((crop_canvas.height-image.height)/2);
        var orig_image_top_x = new_top_x/image.width*init_image_width;
        var orig_image_top_y = new_top_y/image.height*init_image_height;
        var cropped_image_canvas_ctx = cropped_image_canvas.getContext("2d");
        cropped_image_canvas_ctx.drawImage(
            image,
            orig_image_top_x,
            orig_image_top_y,
            orig_window_width,
            orig_window_height, 0, 0,
            cropped_image_canvas.width ,
            cropped_image_canvas.height
        );
    },
    checkInsideRectangle : function(position, top_x, top_y, width, height) {
        if (position.x >= top_x &&
            position.x <= (top_x+width) &&
            position.y >= top_y &&
            position.y <= (top_y+height)) {
                return 1;
            }
         return 0;
    },
    checkImageSize : function(canvas, image, scale_percent, resize_mul, init_image_width, init_image_height, crop_width, crop_height, action = 0) {
        var temp_width = (image.width + (scale_percent*init_image_width/100.0)*resize_mul);
        var temp_height = (image.height + (scale_percent*init_image_height/100.0)*resize_mul);
        if (action==1) {
            temp_width = (image.width - (scale_percent*init_image_width/100.0)*resize_mul);
            temp_height = (image.height - (scale_percent*init_image_height/100.0)*resize_mul);
        }
        if (temp_width<=canvas.width &&
            temp_width>=crop_width &&
            temp_height<=canvas.height &&
            temp_height >=crop_height) {
            return 1;
        }
        return 0;
    },
    cropWindowInsideImage : function(x, y, crop_width, crop_height, canvas, image) {
        var image_top_x = (canvas.width - image.width)/2;
        var image_top_y = (canvas.height - image.height)/2;
        var image_bottom_x = image_top_x + image.width;
        var image_bottom_y = image_top_y + image.height;
        var crop_bottom_x = x + crop_width;
        var crop_bottom_y = y + crop_height;
        if (x>=image_top_x &&
            x<=image_bottom_x &&
            y>=image_top_y &&
            y<=image_bottom_y &&
            crop_bottom_x >= image_top_x &&
            crop_bottom_x<=image_bottom_x &&
            crop_bottom_y>=image_top_y &&
            crop_bottom_y<=image_bottom_y) {
            return 1;
        }
        return 0;
    },
    cropWindowInsideImage_X : function(x, crop_width, canvas, image) {
        var image_top_x = (canvas.width - image.width)/2;
        var image_bottom_x = image_top_x + image.width;
        var crop_bottom_x = x + crop_width;
        if (x>=image_top_x &&
            x<=image_bottom_x &&
            crop_bottom_x >= image_top_x &&
            crop_bottom_x<=image_bottom_x) {
            return 1;
        }
        return 0;
    },
    cropWindowInsideImage_Y : function(y, crop_height, canvas, image) {
        var image_top_y = (canvas.height - image.height)/2;
        var image_bottom_y = image_top_y + image.height;
        var crop_bottom_y = y + crop_height;
        if (y>=image_top_y &&
            y<=image_bottom_y &&
            crop_bottom_y>=image_top_y &&
            crop_bottom_y<=image_bottom_y) {
            return 1;
        }
        return 0;
    },
    getDataUrl : function(options, cropped_image_canvas, window_top_x, window_top_y, image) {
        var dataUrl = cropped_image_canvas.toDataURL();
        var response = {
            'dataUrl' : dataUrl,
            'crop_width' : options.crop_width,
            'crop_height' : options.crop_height,
            'crop_window_top_x' : window_top_x,
            'crop_window_top_y' : window_top_y,
            'image_width' : image.width,
            'image_height' : image.height
        };
        if (options.hasOwnProperty("getDataUrl") && typeof(options.getDataUrl) == "function") {
            options.getDataUrl(response);
        }
    },
    check_crop_canvas_dimensions : function(image, cropped_canvas) {
        var width = image.width;
        var height = image.height;
        if (image.width>cropped_canvas.width || image.height>cropped_canvas.height) {
            var temp = (image.width-cropped_canvas.width)/image.width*100.0;
            var new_height = image.height - (image.height*temp)/100.0;

            var temp2= (image.height-cropped_canvas.height)/image.height*100.0;
            var new_width = image.width - (image.width*temp2)/100.0;

            if (new_height<=cropped_canvas.height) {
                width = cropped_canvas.width;
                height = new_height;
            } else {
                width = new_width;
                height = cropped_canvas.height;
            }
        }
        return {
            'width' : width,
            'height' : height
        };
    },
    check_image_dimensions : function(image, crop_width, crop_height) {
        var height = image.height;
        var width = image.width;

        if (image.width<crop_width || image.height<crop_height) {
            var temp = (crop_width-image.width)/image.width*100.0;
            var new_height = image.height + (image.height*temp)/100.0;

            var temp2 = (crop_height - image.height)/image.height*100.0;
            var new_width = image.width  + (image.width*temp2)*100.0;
            if (new_height>=crop_height) {
                height = new_height;
                width = crop_width;
            } else {
                width = new_width;
                height = crop_height;
            }
        }

        return {
            'height' : height,
            'width' : width
        };
    },
    crop_image_to_window : function(image, crop_width, crop_height) {
        var image_height = image.height;
        var image_width = image.width;

        var window_ratio = ((1.0)*crop_width)/crop_height;
        var image_ratio = ((1.0)*image.width)/image.height;
        if (image_ratio > window_ratio) {
            image_height = crop_height;
            image_width = image_ratio*crop_height;
        } else {
            image_width = crop_width;
            image_height = crop_width/image_ratio;
        }
        return {
            'width' : image_width,
            'height' : image_height
        };
    },
    to_image_url : function(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
               callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        }
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
};



(function($){
    $.fn.cropImageCenter = function(options) {
        var edit_image_container = $(this);
        var image = new Image();
        var crop_image_container = edit_image_container.find("#crop-image-container");
		console.log("HERE");
        if (options.hasOwnProperty("url") &&
            options.hasOwnProperty("crop_height") &&
            options.hasOwnProperty("crop_width")) {
			console.log(options.url);
			if (options.url=="") {
				var errors = { 
					'type' : 'MISSING_PARAMETER', 
					'MESSAGE' : ''
				};
				options.error(errors);
			}
            _image_editor.to_image_url(options.url, function(url){
                image.src = url;
                crop_image_container.find("img").attr("src", url);
            });
        } else {
            var errors = {
                'type' : 'MISSING_PARAMETER',
                'message' : ''
            };
            if (options.hasOwnProperty("error") && typeof(options.error) == "function") {
                options.error(errors);
            }
        }
        image.onload = function(e) {
            var init_image_width = image.width;
            var init_image_height = image.height;
            var new_dimensions = _image_editor.check_image_dimensions(image, options.crop_width, options.crop_height);
            image.width = new_dimensions.width;
            image.height = new_dimensions.height;

            var crop_canvas = crop_image_container.find("#crop-image-canvas")[0];
            crop_canvas.width = crop_image_container.width();
            crop_canvas.height = 400;
            if (options.hasOwnProperty("crop_canvas_height")) {
                crop_canvas.height = options.crop_canvas_height;
            }
            if (options.hasOwnProperty("crop_canvas_width")) {
                crop_canvas.width = options.crop_canvas_width;
            }

            var new_image_dimensions = _image_editor.check_crop_canvas_dimensions(image, crop_canvas);
            image.width = new_image_dimensions.width;
            image.height = new_image_dimensions.height;

            if (options.hasOwnProperty("crop_to_window") && options.crop_to_window == true) {
                var image_window_dimensions = _image_editor.crop_image_to_window(image, options.crop_width, options.crop_height);
                image.width = image_window_dimensions.width;
                image.height = image_window_dimensions.height;
            }
            var crop_canvas_ctx = crop_canvas.getContext("2d");
            var top_x = (crop_canvas.width - options.crop_width)/2;
            var top_y = (crop_canvas.height - options.crop_height)/2;
            if (options.hasOwnProperty("crop_window_top_x") && options.hasOwnProperty("crop_window_top_y")) {
                top_x = options.crop_window_top_x;
                top_y = options.crop_window_top_y;
            }

            var cropped_image_canvas = edit_image_container.find("#cropped-image-canvas")[0];
            _image_editor.clear_canvas(cropped_image_canvas);
            cropped_image_canvas.width = options.crop_width;
            cropped_image_canvas.height = options.crop_height;
            var cropped_image_canvas_ctx = cropped_image_canvas.getContext("2d");
            _image_editor.drawCroppedImage(crop_canvas, cropped_image_canvas, image, top_x, top_y, options.crop_width, options.crop_height, init_image_width, init_image_height);
            _image_editor.getDataUrl(options, cropped_image_canvas, top_x, top_y, image);
        };
    }
}(jQuery));

(function($) {
    $.fn.cropImageFixedWindow = function(options) {
        var edit_image_container = $(this);
        var crop_image_container = edit_image_container.find("#crop-image-container");
        var image = new Image();
        if (options.hasOwnProperty("url") &&
            options.hasOwnProperty("crop_height") &&
            options.hasOwnProperty("crop_width")) {
            _image_editor.to_image_url(options.url, function(url){
                image.src = url;
                crop_image_container.find("img").attr("src", url);
            });
            if (image.width<=0 || image.height<=0) {
                var errors = {
                    'type' : 'IMAGE_NOT_FOUND',
                    'message' : ''
                };
                if (options.hasOwnProperty("error") && typeof(options.error) == "function") {
                    options.error(errors);
                }
            }
        } else {
            var errors = {
                'type' : 'MISSING_PARAMETER',
                'message' : ''
            };
            if (options.hasOwnProperty("error") && typeof(options.error) == "function") {
                options.error(errors);
            }
        }
        image.onload = function(e) {
            var resize_percentage = 10;
            if (options.hasOwnProperty("resize_percentage")) {
                resize_percentage = options.resize_percentage;
            }
            var show_slider = false;
            if (options.hasOwnProperty("show_slider")) {
                show_slider = options.show_slider;
            }
            $(".image-size-buttons").show();
            $("#image-size-input-container").show();
            if (show_slider == true) {
                $(".image-size-buttons").hide();
            } else {
                $("#image-size-input-container").hide();
            }

            var init_image_width = image.width;
            var init_image_height = image.height;

            if (options.hasOwnProperty("image_dimensions")) {
                if (options.image_dimensions.hasOwnProperty("height") && options.image_dimensions.hasOwnProperty("width")) {
                    image.width = options.image_dimensions.width;
                    image.height = options.image_dimensions.height;
                }
            }
            var new_dimensions = _image_editor.check_image_dimensions(image, options.crop_width, options.crop_height);
            image.width = new_dimensions.width;
            image.height = new_dimensions.height;
            var crop_canvas = crop_image_container.find("#crop-image-canvas")[0];
            crop_canvas.width = crop_image_container.width();
            crop_canvas.height = 400;
            if (options.hasOwnProperty("crop_canvas_height")) {
                crop_canvas.height = options.crop_canvas_height;
            }
            if (options.hasOwnProperty("crop_canvas_width")) {
                crop_canvas.width = options.crop_canvas_width;
            }

            var new_image_dimensions = _image_editor.check_crop_canvas_dimensions(image, crop_canvas);
            image.width = new_image_dimensions.width;
            image.height = new_image_dimensions.height;

            var crop_canvas_ctx = crop_canvas.getContext("2d");
            _image_editor.drawImage(crop_canvas, image);
            var top_x = (crop_canvas.width - options.crop_width)/2;
            var top_y = (crop_canvas.height - options.crop_height)/2;
            if (options.hasOwnProperty("crop_window_top_x") && options.hasOwnProperty("crop_window_top_y")) {
                top_x = options.crop_window_top_x;
                top_y = options.crop_window_top_y;
            }
            _image_editor.drawFilledRectangle(crop_canvas, top_x, top_y, options.crop_width, options.crop_height);

            var image_size_input = edit_image_container.find("#image-size-input-container").find("#image-size");
            var min_dimension = image.height;
            var image_size_max = crop_canvas.height;
            var image_size_min = options.crop_height;
            if (image.width<image.height) {
                min_dimension = image.width;
                image_size_max = crop_canvas.width;
                image_size_min = options.crop_width;
            }
            var step = min_dimension*resize_percentage/100.0;
            image_size_input.attr("step", step);
            image_size_input.attr("min", image_size_min);
            image_size_input.attr("max", image_size_max);
            image_size_input.val(min_dimension);

            var cropped_image_canvas = edit_image_container.find("#cropped-image-canvas")[0];
            _image_editor.clear_canvas(cropped_image_canvas);
            cropped_image_canvas.width = options.crop_width;
            cropped_image_canvas.height = options.crop_height;
            var cropped_image_canvas_ctx = cropped_image_canvas.getContext("2d");
            _image_editor.drawCroppedImage(crop_canvas, cropped_image_canvas, image, top_x, top_y, options.crop_width, options.crop_height, init_image_width, init_image_height);
            _image_editor.getDataUrl(options, cropped_image_canvas, top_x, top_y, image);

            crop_image_container.off("mousedown").on("mousedown", function(e){
               var down_position = _image_editor.get_position(crop_canvas, e);
               if (_image_editor.checkInsideRectangle(down_position, top_x, top_y, options.crop_width, options.crop_height)) {
                 crop_image_container.off("mousemove").on("mousemove", function(evt){
                    var position = _image_editor.get_position(crop_canvas, evt);
                    var dx = position.x - down_position.x;
                    var dy = position.y - down_position.y;
                    var f=0;
                    if (_image_editor.cropWindowInsideImage_X(top_x+dx, options.crop_width, crop_canvas, image)) {
                        top_x = top_x + dx;
                        top_y = top_y;
                        f=1;
                    }

                    if (_image_editor.cropWindowInsideImage_Y(top_y+dy, options.crop_height, crop_canvas, image)) {
                        top_x = top_x;
                        top_y = top_y+dy;
                        f=1;
                    }

                    if (f==1) {
                        _image_editor.clear_canvas(crop_canvas);
                        _image_editor.drawImage(crop_canvas, image);
                        _image_editor.drawFilledRectangle(crop_canvas, top_x, top_y, options.crop_width, options.crop_height);
                        down_position = position;
                    }
                 });
               }
            });

            var init_width = init_image_width;
            var init_height = init_image_height;
            init_image_width = image.width;
            init_image_height = image.height;

            crop_image_container.off("mouseup").on("mouseup", function(){
                crop_image_container.off("mousemove");
                _image_editor.clear_canvas(cropped_image_canvas);
                _image_editor.drawCroppedImage(crop_canvas, cropped_image_canvas, image, top_x, top_y, options.crop_width, options.crop_height, init_width, init_height);
                _image_editor.getDataUrl(options, cropped_image_canvas, top_x, top_y, image);
            });

            var resize_mul = 1;
            edit_image_container.find(".image-size-buttons").find(".plus-button").off("click").on("click", function(){
                if (_image_editor.checkImageSize(crop_canvas, image, resize_percentage, resize_mul, init_image_width, init_image_height, options.crop_width, options.crop_height, 0)) {
                    image.width = image.width +(resize_percentage*(init_image_width)/100)*resize_mul;
                    image.height = image.height + (resize_percentage*(init_image_height)/100)*resize_mul;

                    _image_editor.clear_canvas(crop_canvas);
                    _image_editor.drawImage(crop_canvas, image);
                    var window_top = _image_editor.resetWindow(crop_canvas, image, top_x, top_y, options.crop_width, options.crop_height);
                    top_x = window_top.top_x;
                    top_y = window_top.top_y;
                    _image_editor.drawFilledRectangle(crop_canvas, top_x, top_y, options.crop_width, options.crop_height);

                    _image_editor.clear_canvas(cropped_image_canvas);
                    _image_editor.drawCroppedImage(crop_canvas, cropped_image_canvas, image, top_x, top_y, options.crop_width, options.crop_height, init_width, init_height);
                    _image_editor.getDataUrl(options, cropped_image_canvas, top_x, top_y, image);
                    init_image_width = image.width;
                    init_image_height = image.height;
                }
            });

            edit_image_container.find(".image-size-buttons").find(".minus-button").off("click").on("click", function(){
                if (_image_editor.checkImageSize(crop_canvas, image, resize_percentage, resize_mul, init_image_width, init_image_height, options.crop_width, options.crop_height, 1)) {
                    image.width = image.width -(resize_percentage*(init_image_width)/100)*resize_mul;
                    image.height = image.height - (resize_percentage*(init_image_height)/100)*resize_mul;

                    _image_editor.clear_canvas(crop_canvas);
                    _image_editor.drawImage(crop_canvas, image);
                    var window_top = _image_editor.resetWindow(crop_canvas, image, top_x, top_y, options.crop_width, options.crop_height);
                    top_x = window_top.top_x;
                    top_y = window_top.top_y;
                    _image_editor.drawFilledRectangle(crop_canvas, top_x, top_y, options.crop_width, options.crop_height);

                    _image_editor.clear_canvas(cropped_image_canvas);
                    _image_editor.drawCroppedImage(crop_canvas, cropped_image_canvas, image, top_x, top_y, options.crop_width, options.crop_height, init_width, init_height);
                    _image_editor.getDataUrl(options, cropped_image_canvas, top_x, top_y, image);
                    init_image_width = image.width;
                    init_image_height = image.height;
                }
            });
            var prev_val = image_size_input.val();
            image_size_input.off("change").on("change", function(){
                var current_val = $(this).val();
                var image_width_before = image.width;
                if (current_val>=prev_val) {
                    resize_mul = (current_val-prev_val)/step;
                    edit_image_container.find(".image-size-buttons").find(".plus-button").trigger("click");
                } else {
                    resize_mul = (prev_val-current_val)/step;
                    edit_image_container.find(".image-size-buttons").find(".minus-button").trigger("click");
                }
                var image_width_after = image.width;
                if (image_width_after == image_width_before) {
                    $(this).val(prev_val);
                } else {
                    prev_val = current_val;
                }
                resize_mul = 1;
            });
        }
    }
}(jQuery));

$(document).ready(function(){
    _image_editor.ready();
});