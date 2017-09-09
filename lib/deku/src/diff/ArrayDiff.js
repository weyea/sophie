import {isText, isThunk, isSameThunk, isNative, isEmpty, groupByKey, createPath} from '../element'



var EDIT_LEAVE = 0;
var EDIT_UPDATE = 1;
var EDIT_ADD = 2;
var EDIT_DELETE = 3;

function ArraySplice() {
}

ArraySplice.prototype = {

    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function (current, currentStart, currentEnd, old, oldStart, oldEnd) {
        // "Deletion" columns
        var rowCount = oldEnd - oldStart + 1;
        var columnCount = currentEnd - currentStart + 1;
        var distances = new Array(rowCount);

        // "Addition" rows. Initialize null column.
        for (var i = 0; i < rowCount; i++) {
            distances[i] = new Array(columnCount);
            distances[i][0] = i;
        }

        // Initialize null row
        for (var j = 0; j < columnCount; j++)
            distances[0][j] = j;

        for (var i = 1; i < rowCount; i++) {
            for (var j = 1; j < columnCount; j++) {
                if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
                    distances[i][j] = distances[i - 1][j - 1];
                else {
                    var north = distances[i - 1][j] + 1;
                    var west = distances[i][j - 1] + 1;
                    distances[i][j] = north < west ? north : west;
                }
            }
        }

        return distances;
    },

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function (distances) {
        var i = distances.length - 1;
        var j = distances[0].length - 1;
        var current = distances[i][j];
        var edits = [];
        while (i > 0 || j > 0) {
            if (i == 0) {
                edits.push(EDIT_ADD);
                j--;
                continue;
            }
            if (j == 0) {
                edits.push(EDIT_DELETE);
                i--;
                continue;
            }
            var northWest = distances[i - 1][j - 1];
            var west = distances[i - 1][j];
            var north = distances[i][j - 1];

            var min;
            if (west < north)
                min = west < northWest ? west : northWest;
            else
                min = north < northWest ? north : northWest;

            if (min == northWest) {
                if (northWest == current) {
                    edits.push(EDIT_LEAVE);
                } else {
                    edits.push(EDIT_UPDATE);
                    current = northWest;
                }
                i--;
                j--;
            } else if (min == west) {
                edits.push(EDIT_DELETE);
                i--;
                current = west;
            } else {
                edits.push(EDIT_ADD);
                j--;
                current = north;
            }
        }

        edits.reverse();
        return edits;
    },

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function (current, currentStart, currentEnd, old, oldStart, oldEnd) {
        var prefixCount = 0;
        var suffixCount = 0;

        var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
        if (currentStart == 0 && oldStart == 0)
            prefixCount = this.sharedPrefix(current, old, minLength);

        if (currentEnd == current.length && oldEnd == old.length)
            suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

        currentStart += prefixCount;
        oldStart += prefixCount;
        currentEnd -= suffixCount;
        oldEnd -= suffixCount;

        if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
            return [];

        if (currentStart == currentEnd) {
            var splice = newSplice(currentStart, [], [], 0);
            while (oldStart < oldEnd)splice.removed.push(old[oldStart++]);

            return [splice];
        } else if (oldStart == oldEnd) {
            var splice = newSplice(currentStart, [], [], currentEnd - currentStart);
            while (currentStart < currentEnd) splice.added.push(current[currentStart++]);
            return [splice];
        }

        var ops = this.spliceOperationsFromEditDistances(
            this.calcEditDistances(current, currentStart, currentEnd,
                old, oldStart, oldEnd));

        var splice = undefined;
        var splices = [];
        var index = currentStart;
        var oldIndex = oldStart;
        for (var i = 0; i < ops.length; i++) {
            switch (ops[i]) {

                case EDIT_LEAVE:
                    if (splice) {
                        splices.push(splice);
                        splice = undefined;
                    }

                    index++;
                    oldIndex++;
                    break;
                case EDIT_UPDATE:
                    if (!splice)
                        splice = newSplice(index, [], [], 0);

                    splice.addedCount++;
                    splice.added.push(current[index]);
                    index++;

                    splice.removed.push(old[oldIndex]);
                    oldIndex++;
                    break;
                case EDIT_ADD:
                    if (!splice)
                        splice = newSplice(index, [], [], 0);
                    splice.added.push(current[index]);
                    splice.addedCount++;
                    index++;
                    break;
                case EDIT_DELETE:
                    if (!splice)
                        splice = newSplice(index, [], [], 0);

                    splice.removed.push(old[oldIndex]);
                    oldIndex++;
                    break;
            }
        }

        if (splice) {
            splices.push(splice);
        }
        return splices;
    },

    sharedPrefix: function (current, old, searchLength) {
        for (var i = 0; i < searchLength; i++)
            if (!this.equals(current[i], old[i]))
                return i;
        return searchLength;
    },

    sharedSuffix: function (current, old, searchLength) {
        var index1 = current.length;
        var index2 = old.length;
        var count = 0;
        while (count < searchLength && this.equals(current[--index1], old[--index2]))
            count++;

        return count;
    },

    calculateSplices: function (current, previous) {
        return this.calcSplices(current, 0, current.length, previous, 0,
            previous.length);
    },

    equals: function (currentValue, previousValue) {
        return currentValue === previousValue;
    }
};


function newSplice(index, removed, added, addedCount) {
    return {
        index: index,
        removed: removed,
        added:added,
        addedCount: addedCount
    };
}


var LayoutArraySplice = new ArraySplice();

LayoutArraySplice.equals = function(next, prev){

    // No left node to compare it to
    // TODO: This should just return a createNode action
    if (prev === undefined) {
        throw new Error('Left node must not be null or undefined')
    }

    // Bail out and skip updating this whole sub-tree
    if (prev === next) {
        return true
    }

    if(prev.key&&next.key&& (next.key == prev.key)){
        return true;
    }

    if((prev.nativeNode&&next.nativeNode)&& (next.nativeNode == prev.nativeNode)){
        return true;
    }


    // Native
    if (isNative(prev)&&isNative(next)) {
        if (prev.tagName == next.tagName) {
            return true;
        }
    }

    // Text
    if (isText(prev)&&isText(next)) {
        if (prev.nodeValue == next.nodeValue) {
            return true;
        }

    }
    // html
    if (prev.type == "html"&&prev.type == "html") {
        if (prev.nodeValue == next.nodeValue) {
            return true;
        }
    }

    // Thunk
    if (isThunk(prev)&&isThunk(next)) {
        if (isSameThunk(prev, next)) {
            return true;
        }
    }


}


function diffArray(current, old) {
    var  splices = LayoutArraySplice.calculateSplices(current, old);

    //展开
    var results = []

    for(var i = 0;i<splices.length; i++){
        var splice = splices[i]
        //添加
        if(splice.added.length&&!splice.removed.length){
            for(var j = 0 ; j<splice.added.length;j++){
                results.push({
                    type :  "add",
                    newLayout:splice.added[j]
                })
            }

        }
        //删除
        else if(!splice.added.length&&splice.removed.length){
            for(var j = 0 ; j<splice.removed.length;j++){
                results.push({
                    type :  "remove",
                    originLayout:splice.removed[j]
                })
            }
        }

        if(splice.added.length&&splice.removed.length){
            var minLength = splice.added.length ;
             if(splice.removed.length > splice.added.length){
                 minLength = splice.added.length
                 for(var j = minLength;  j < splice.removed.length; j ++){
                     results.push({
                         type :  "remove",
                         originLayout:splice.removed[j]
                     })
                 }
             }
            if(  splice.added.length > splice.removed.length){
                minLength = splice.removed.length
                for(var j = minLength;  j < splice.added.length; j ++){
                    results.push({
                        type :  "add",
                        newLayout:splice.added[j]
                    })
                }
            }

            for(var j = 0 ; j< minLength; j++){
                if(splice.added[j].type&&splice.removed[j].type&&splice.added[j].type == splice.removed[j].type){
                    results.push({
                        type :  "update",
                        newLayout:splice.added[j],
                        originLayout:splice.removed[j]
                    })
                }
                else if(splice.added[j].el&&splice.removed[j].el){
                    results.push({
                        type :  "move",
                        newLayout:splice.added[j],
                        originLayout:splice.removed[j]
                    })
                }
                else{
                    results.push({
                        type :  "change",
                        newLayout:splice.added[j],
                        originLayout:splice.removed[j]
                    })
                }


            }

        }
    }
    return results
}




play.diffArray = diffArray;
module.exports = diffArray


