var request = require('request');

module.exports = function (req, res, next) {
    try {
        var params = req.query,
            id = params.id,
            sheet = params.sheet || "sheet",
            //url = 'https://spreadsheets.google.com/feeds/list/' + id + '/' + sheet + '/public/values?alt=json';
            url = `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${sheet}?key=AIzaSyBvsVzzlzjDbdIATuwwgjta51Q4VC0XXWY`;
        //console.log(`${url}`);
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(response.body);
                var responseObj = {};
                var rows = [];
                // var columns = {};
                // if (data && data.feed && data.feed.entry) {
                //     for (var i = 0; i < data.feed.entry.length; i++) {
                //         var entry = data.feed.entry[i];
                //         var keys = Object.keys(entry);
                //         var newRow = {};
                //         var queried = !query;
                //         for (var j = 0; j < keys.length; j++) {
                //             var gsxCheck = keys[j].indexOf('gsx$');
                //             if (gsxCheck > -1) {
                //                 var key = keys[j];
                //                 var name = key.substring(4);
                //                 var content = entry[key];
                //                 var value = content.$t;
                //                 if (query) {
                //                     if (value.toLowerCase().indexOf(query.toLowerCase()) > -1 ) {
                //                         queried = true;
                //                     }
                //                 }
                //                 if (Object.keys(params).indexOf(name) > -1) {
                //                     queried = false;
                //                     if (value.toLowerCase() === params[name].toLowerCase()) {
                //                         queried = true;
                //                     }
                //                 }
                //                 if (useIntegers === true && !isNaN(value)) {
                //                     value = Number(value);
                //                 }
                //                 newRow[name] = value;
                //                 if (queried === true) {
                //                     if (!columns.hasOwnProperty(name)) {
                //                         columns[name] = [];
                //                         columns[name].push(value);
                //                     } else {
                //                         columns[name].push(value);
                //                     }
                //                 }
                //             }
                //         }
                //         if (queried === true) {
                //             rows.push(newRow);
                //         }
                //     }
                //     if (showColumns === true) {
                //         responseObj['columns'] = columns;
                //     }
                //     if (showRows === true) {
                //         responseObj['rows'] = rows;
                //     }
                //     return res.status(200).json(responseObj);
                // } else {
                //     return res.status(response.statusCode).json(error);
                // }

                if(data && data.values && data.values.length > 0){
                    var headerObj = data.values[0];
                    for(var i = 1; i < data.values.length; i++){
                        var v = data.values[i];
                        var newRow = {};

                        for(var j = 0; j < headerObj.length; j++){
                            if(isNaN(v[j]))
                                newRow[headerObj[j].toLowerCase()] = v[j];
                            else
                                newRow[headerObj[j].toLowerCase()] = Number(v[j]);
                        }

                        rows.push(newRow);
                    }
                    responseObj['rows'] = rows;
                    return res.status(200).json(responseObj);
                }else{
                    return res.status(response.statusCode).json(error);
                }
            } else {
                return res.status(200).json('No entries returned. Do you have the right ID?');
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};
