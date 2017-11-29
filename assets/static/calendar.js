(function($) {
    $.fn.gcal = function(options) {
        var parent = (this.append('<ul class="gcal-events"></ul>')
                      .find('.gcal-events'));
        var pad = function(n) {
            return n < 10 ? '0' + n : n;
        };
        var parsedate = function(datestring) {
            var parts = datestring.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/);
            var date = new Date(parseInt(parts[1]),
                                parseInt(parts[2]) - 1,
                                parseInt(parts[3]));
            return date;
        };
        var formatitemdate = function(item) {
            if (item.start.date) {
                return parsedate(item.start.date).toDateString();
            } else {
                var parts = item.start.dateTime.split('T');
                var date = parsedate(parts[0]);
                var timeparts = parts[1].match(/([0-9]{2}):([0-9]{2}):([0-9]{2})/);
                date.setUTCHours(parseInt(timeparts[1]));
                date.setUTCMinutes(parseInt(timeparts[2]));
                date.setUTCSeconds(parseInt(timeparts[3]));
                return (date.toDateString()
                        + ' '
                        + pad(date.getHours())
                        + ':'
                        + pad(date.getMinutes()));
            };
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
                    'maxResults': 4,
                    'fields': 'items(description,end,start,summary)'
                });
            }).then(function(resp) {
                $.each(resp.result.items, function(index, item) {
                    console.log(item);
                    var $node = $('<li class="gcal-event">' +
                                  '<div class="gcal-event-summary"></div>' +
                                  '<div class="gcal-event-date"></div>' +
                                  '<div class="gcal-event-description"></div>' +
                                  '</div>');
                    $node.find('.gcal-event-date').text(formatitemdate(item));
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
