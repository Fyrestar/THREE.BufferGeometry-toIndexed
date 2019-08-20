THREE.BufferGeometry.prototype.toIndexed = function() {

    let prec = 0;
    let list = [];
    let vertices = {};

    function store(x, y, z, v) {


        const id = Math.floor( x * prec ) + '_' + Math.floor( y * prec ) + '_'  + Math.floor( z * prec );

        if ( vertices[id] === undefined ) {

            vertices[id] = list.length;


            list.push(v);

        }

        return vertices[id];

    }

    function indexBufferGeometry(src, dst) {



        const position = src.attributes.position.array;

        const faceCount = ( position.length / 3 ) / 3;


        const type = faceCount * 3 > 65536 ? Uint32Array : Uint16Array;

        const indexArray = new type(faceCount * 3);

        for ( let i = 0, l = faceCount; i < l; i ++ ) {

            const offset = i * 9;

            indexArray[i * 3    ] = store(position[offset], position[offset + 1], position[offset + 2], i * 3);
            indexArray[i * 3 + 1] = store(position[offset + 3], position[offset + 4], position[offset + 5], i * 3 + 1);
            indexArray[i * 3 + 2] = store(position[offset + 6], position[offset + 7], position[offset + 8], i * 3 + 2);

        }

        dst.index = new THREE.BufferAttribute(indexArray, 1);



        const count = list.length;

        for ( let key in src.attributes ) {

            const src_attribute = src.attributes[key];
            const dst_attribute = new THREE.BufferAttribute(new src_attribute.array.constructor(count * src_attribute.itemSize), src_attribute.itemSize);

            const dst_array = dst_attribute.array;
            const src_array = src_attribute.array;

            switch ( src_attribute.itemSize ) {
                case 1:

                    for ( let i = 0, l = list.length; i < l; i ++ ) {

                        dst_array[i] = src_array[list[i]];

                    }


                    break;
                case 2:

                    for ( let i = 0, l = list.length; i < l; i ++ ) {

                        const index = list[i] * 2;

                        const offset = i * 2;

                        dst_array[offset] = src_array[index];
                        dst_array[offset + 1] = src_array[index + 1];

                    }


                    break;
                case 3:

                    for ( let i = 0, l = list.length; i < l; i ++ ) {

                        const index = list[i] * 3;

                        const offset = i * 3;

                        dst_array[offset] = src_array[index];
                        dst_array[offset + 1] = src_array[index + 1];
                        dst_array[offset + 2] = src_array[index + 2];


                    }

                    break;
                case 4:

                    for ( let i = 0, l = list.length; i < l; i ++ ) {

                        const index = list[i] * 4;

                        const offset = i * 4;

                        dst_array[offset] = src_array[index];
                        dst_array[offset+ 1] = src_array[index + 1];
                        dst_array[offset + 2] = src_array[index + 2];
                        dst_array[offset + 3] = src_array[index + 3];


                    }

                    break;
            }


            dst.attributes[key] = dst_attribute;


        }


        dst.boundingSphere = new THREE.Sphere;
        dst.computeBoundingSphere();

        dst.boundingSphere = new THREE.Box3;
        dst.computeBoundingBox();



        // Release data

        vertices = {};
        list = [];

    }

    return function( precision ) {

        prec = Math.pow(10,  precision || 6 );

        const geometry = new THREE.BufferGeometry;

        indexBufferGeometry(this, geometry);

        return geometry;

    }

}();
