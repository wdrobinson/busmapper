if (google.maps) {
    (function () {

        var labels = [];

        google.maps.Marker.prototype.setLabel = function (label) {
            if (this.label) {
                if (this.label.labelText == label) return;
                this.label.setMap(null);
                this.label = null;
                console.log('Updating label ' + label);                
            };
            this.label = new MarkerLabel(label);
            this.label.labelText = label;
            this.label.bindTo('map', this);
            this.label.bindTo('position', this);
            labels.push(this.label);

            google.maps.event.addListenerOnce(this, 'map_changed', function () {
                this.label.setVisible(this.map.getZoom() >= 15);
                if (!this.map.simpleLabelZoomListenerAdded) {
                    google.maps.event.addListener(this.map, 'zoom_changed', function () {
                        var zoom = this.getZoom();
                        // iterate over labels and call setVisible
                        for (i = 0; i < labels.length; i++) {
                            labels[i].setVisible(zoom >= 15);
                        }
                    });
                };
                this.map.simpleLabelZoomListenerAdded = true;                
            });
        };

        var MarkerLabel = function (label) {
            var label = new google.maps.Marker({
                icon: createLabelIcon(label)
            });
            return label;
        };

        function createLabelIcon(label) {
            var font = "900 12px 'Arial Black', Gadget, sans-serif";
            var lineWidth = 3;
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");

            ctx.font = font;
            var canvasWidth = ctx.measureText(label).width + lineWidth;
            var canvasHeight = 20;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            ctx.font = font;
            ctx.strokeStyle = "#000000";
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.lineWidth = lineWidth;
            ctx.lineJoin = 'round';
            ctx.strokeText(label, canvasWidth / 2, canvasHeight / 2);
            ctx.fillText(label, canvasWidth / 2, canvasHeight / 2);

            //Create and return icon
            var icon = {
                url: canvas.toDataURL(),
                anchor: new google.maps.Point(canvasWidth / 2, -7)
            }
            return icon;
        }
    })();
} else {
    console.log('Google maps not found!');
}