(function($) {
    $.fn.gcal = function(options) {
        var parent = (this.append('<ul class="gcal-events"></ul>')
                      .find('.gcal-events'));
        var pad = function(n) {
            return n < 10 ? '0' + n : n;
        };
        gapi.load('client', function() {
            gapi.client.setApiKey(options.apikey);
            gapi.client.load('calendar', 'v3').then(function() {
                var now = new Date();
                var datestr = (now.getUTCFullYear() + '-' +
                               pad(now.getUTCMonth()+1) + '-' +
                               pad(now.getUTCDate()) +
                               'T00:00:00Z');
                return gapi.client.calendar.events.list({
                    'calendarId': options.calenderid,
                    'orderBy': 'startTime',
                    'singleEvents': 'true',
                    'timeMin': datestr,
                    'maxResults': 10,
                    'fields': 'items(description,end,start,summary)'
                });
            }).then(function(resp) {
                $.each(resp.result.items, function(index, item) {
                    console.log(item);
                    var $node = $('<li class="gcal-event">' +
                                  '<div class="gcal-event-date"></div>' +
                                  '<div class="gcal-event-summary"></div>' +
                                  '<div class="gcal-event-description"></div>' +
                                  '</div>');
                    $node.find('.gcal-event-date').text(item.start.date || item.start.dateTime);
                    $node.find('.gcal-event-summary').text(item.summary);
                    var $descnode = $node.find('.gcal-event-description');
                    if (item.description) {
                        $descnode.text(item.description)
                    } else {
                        $descnode.remove();
                    }
                    parent.append($node);
                });
            });
        });
        return this;
    };
}(jQuery));
