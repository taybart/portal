function _define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class QRUtil {
    static getBCHDigit(data) {
        let digit = 0;
        while(0 != data){
            digit += 1;
            data >>>= 1;
        }
        return digit;
    }
    static getBCHTypeInfo(data) {
        let d = data << 10;
        while(this.getBCHDigit(d) - this.getBCHDigit(this.G15) >= 0)d ^= this.G15 << this.getBCHDigit(d) - this.getBCHDigit(this.G15);
        return (data << 10 | d) ^ this.G15_MASK;
    }
    static getBCHTypeNumber(data) {
        let d = data << 12;
        while(this.getBCHDigit(d) - this.getBCHDigit(this.G18) >= 0)d ^= this.G18 << this.getBCHDigit(d) - this.getBCHDigit(this.G18);
        return data << 12 | d;
    }
    static getPatternPosition(typeNumber) {
        return this.PATTERN_POSITION_TABLE[typeNumber - 1];
    }
    static getMaskFunction(maskPattern) {
        switch(maskPattern){
            case 0:
                return (i, j)=>(i + j) % 2 == 0;
            case 1:
                return (i, j)=>i % 2 == 0;
            case 2:
                return (i, j)=>j % 3 == 0;
            case 3:
                return (i, j)=>(i + j) % 3 == 0;
            case 4:
                return (i, j)=>(Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
            case 5:
                return (i, j)=>i * j % 2 + i * j % 3 == 0;
            case 6:
                return (i, j)=>(i * j % 2 + i * j % 3) % 2 == 0;
            case 7:
                return (i, j)=>(i * j % 3 + (i + j) % 2) % 2 == 0;
            default:
                throw new Error('bad maskPattern:' + maskPattern);
        }
    }
    static getErrorCorrectPolynomial(errorCorrectLength) {
        throw new Error('Not implemented');
    }
    static getLengthInBits(mode, type) {
        if (4 != mode || type < 1 || type > 40) throw new Error('mode: ' + mode + '; type: ' + type);
        return type < 10 ? 8 : 16;
    }
    static getLostPoint(qrcode) {
        const moduleCount = qrcode.getModuleCount();
        let lostPoint = 0;
        for(let row = 0; row < moduleCount; row += 1)for(let col = 0; col < moduleCount; col += 1){
            let sameCount = 0;
            const dark = qrcode.isDark(row, col);
            for(let r = -1; r <= 1; r += 1)if (!(row + r < 0) && !(moduleCount <= row + r)) {
                for(let c = -1; c <= 1; c += 1)if (!(col + c < 0) && !(moduleCount <= col + c)) {
                    if (0 != r || 0 != c) {
                        if (dark == qrcode.isDark(row + r, col + c)) sameCount += 1;
                    }
                }
            }
            if (sameCount > 5) lostPoint += 3 + sameCount - 5;
        }
        for(let row = 0; row < moduleCount - 1; row += 1)for(let col = 0; col < moduleCount - 1; col += 1){
            let count = 0;
            if (qrcode.isDark(row, col)) count += 1;
            if (qrcode.isDark(row + 1, col)) count += 1;
            if (qrcode.isDark(row, col + 1)) count += 1;
            if (qrcode.isDark(row + 1, col + 1)) count += 1;
            if (0 == count || 4 == count) lostPoint += 3;
        }
        for(let row = 0; row < moduleCount; row += 1)for(let col = 0; col < moduleCount - 6; col += 1)if (qrcode.isDark(row, col) && !qrcode.isDark(row, col + 1) && qrcode.isDark(row, col + 2) && qrcode.isDark(row, col + 3) && qrcode.isDark(row, col + 4) && !qrcode.isDark(row, col + 5) && qrcode.isDark(row, col + 6)) lostPoint += 40;
        for(let col = 0; col < moduleCount; col += 1)for(let row = 0; row < moduleCount - 6; row += 1)if (qrcode.isDark(row, col) && !qrcode.isDark(row + 1, col) && qrcode.isDark(row + 2, col) && qrcode.isDark(row + 3, col) && qrcode.isDark(row + 4, col) && !qrcode.isDark(row + 5, col) && qrcode.isDark(row + 6, col)) lostPoint += 40;
        let darkCount = 0;
        for(let col = 0; col < moduleCount; col += 1)for(let row = 0; row < moduleCount; row += 1)if (qrcode.isDark(row, col)) darkCount += 1;
        const ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
        lostPoint += 10 * ratio;
        return lostPoint;
    }
}
_define_property(QRUtil, "PATTERN_POSITION_TABLE", [
    [],
    [
        6,
        18
    ],
    [
        6,
        22
    ],
    [
        6,
        26
    ],
    [
        6,
        30
    ],
    [
        6,
        34
    ],
    [
        6,
        22,
        38
    ],
    [
        6,
        24,
        42
    ],
    [
        6,
        26,
        46
    ],
    [
        6,
        28,
        50
    ],
    [
        6,
        30,
        54
    ],
    [
        6,
        32,
        58
    ],
    [
        6,
        34,
        62
    ],
    [
        6,
        26,
        46,
        66
    ],
    [
        6,
        26,
        48,
        70
    ],
    [
        6,
        26,
        50,
        74
    ],
    [
        6,
        30,
        54,
        78
    ],
    [
        6,
        30,
        56,
        82
    ],
    [
        6,
        30,
        58,
        86
    ],
    [
        6,
        34,
        62,
        90
    ],
    [
        6,
        28,
        50,
        72,
        94
    ],
    [
        6,
        26,
        50,
        74,
        98
    ],
    [
        6,
        30,
        54,
        78,
        102
    ],
    [
        6,
        28,
        54,
        80,
        106
    ],
    [
        6,
        32,
        58,
        84,
        110
    ],
    [
        6,
        30,
        58,
        86,
        114
    ],
    [
        6,
        34,
        62,
        90,
        118
    ],
    [
        6,
        26,
        50,
        74,
        98,
        122
    ],
    [
        6,
        30,
        54,
        78,
        102,
        126
    ],
    [
        6,
        26,
        52,
        78,
        104,
        130
    ],
    [
        6,
        30,
        56,
        82,
        108,
        134
    ],
    [
        6,
        34,
        60,
        86,
        112,
        138
    ],
    [
        6,
        30,
        58,
        86,
        114,
        142
    ],
    [
        6,
        34,
        62,
        90,
        118,
        146
    ],
    [
        6,
        30,
        54,
        78,
        102,
        126,
        150
    ],
    [
        6,
        24,
        50,
        76,
        102,
        128,
        154
    ],
    [
        6,
        28,
        54,
        80,
        106,
        132,
        158
    ],
    [
        6,
        32,
        58,
        84,
        110,
        136,
        162
    ],
    [
        6,
        26,
        54,
        82,
        110,
        138,
        166
    ],
    [
        6,
        30,
        58,
        86,
        114,
        142,
        170
    ]
]);
_define_property(QRUtil, "G15", 1335);
_define_property(QRUtil, "G18", 7973);
_define_property(QRUtil, "G15_MASK", 21522);
class QRMath {
    static glog(n) {
        if (n < 1) throw new Error('glog(' + n + ')');
        return this.LOG_TABLE[n];
    }
    static gexp(n) {
        while(n < 0)n += 255;
        while(n >= 256)n -= 255;
        return this.EXP_TABLE[n];
    }
}
_define_property(QRMath, "EXP_TABLE", new Array(256));
_define_property(QRMath, "LOG_TABLE", new Array(256));
(()=>{
    for(let i = 0; i < 8; i += 1)QRMath.EXP_TABLE[i] = 1 << i;
    for(let i = 8; i < 256; i += 1)QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
    for(let i = 0; i < 255; i += 1)QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
})();
class QRRSBlock {
    static getRsBlockTable(typeNumber, errorCorrectLevel) {
        switch(errorCorrectLevel){
            case 1:
                return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
            case 0:
                return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
            case 3:
                return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
            case 2:
                return this.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
            default:
                return;
        }
    }
    static getRSBlocks(typeNumber, errorCorrectLevel) {
        const rsBlock = this.getRsBlockTable(typeNumber, errorCorrectLevel);
        if (void 0 === rsBlock) throw new Error('bad rs block @ typeNumber:' + typeNumber + '/errorCorrectLevel:' + errorCorrectLevel);
        const length = rsBlock.length / 3;
        const list = [];
        for(let i = 0; i < length; i += 1){
            const count = rsBlock[3 * i + 0];
            const totalCount = rsBlock[3 * i + 1];
            const dataCount = rsBlock[3 * i + 2];
            for(let j = 0; j < count; j += 1)list.push(new QRRSBlock(totalCount, dataCount));
        }
        return list;
    }
    constructor(totalCount, dataCount){
        _define_property(this, "totalCount", void 0);
        _define_property(this, "dataCount", void 0);
        this.totalCount = totalCount;
        this.dataCount = dataCount;
    }
}
_define_property(QRRSBlock, "RS_BLOCK_TABLE", [
    [
        1,
        26,
        19
    ],
    [
        1,
        26,
        16
    ],
    [
        1,
        26,
        13
    ],
    [
        1,
        26,
        9
    ],
    [
        1,
        44,
        34
    ],
    [
        1,
        44,
        28
    ],
    [
        1,
        44,
        22
    ],
    [
        1,
        44,
        16
    ],
    [
        1,
        70,
        55
    ],
    [
        1,
        70,
        44
    ],
    [
        2,
        35,
        17
    ],
    [
        2,
        35,
        13
    ],
    [
        1,
        100,
        80
    ],
    [
        2,
        50,
        32
    ],
    [
        2,
        50,
        24
    ],
    [
        4,
        25,
        9
    ],
    [
        1,
        134,
        108
    ],
    [
        2,
        67,
        43
    ],
    [
        2,
        33,
        15,
        2,
        34,
        16
    ],
    [
        2,
        33,
        11,
        2,
        34,
        12
    ],
    [
        2,
        86,
        68
    ],
    [
        4,
        43,
        27
    ],
    [
        4,
        43,
        19
    ],
    [
        4,
        43,
        15
    ],
    [
        2,
        98,
        78
    ],
    [
        4,
        49,
        31
    ],
    [
        2,
        32,
        14,
        4,
        33,
        15
    ],
    [
        4,
        39,
        13,
        1,
        40,
        14
    ],
    [
        2,
        121,
        97
    ],
    [
        2,
        60,
        38,
        2,
        61,
        39
    ],
    [
        4,
        40,
        18,
        2,
        41,
        19
    ],
    [
        4,
        40,
        14,
        2,
        41,
        15
    ],
    [
        2,
        146,
        116
    ],
    [
        3,
        58,
        36,
        2,
        59,
        37
    ],
    [
        4,
        36,
        16,
        4,
        37,
        17
    ],
    [
        4,
        36,
        12,
        4,
        37,
        13
    ],
    [
        2,
        86,
        68,
        2,
        87,
        69
    ],
    [
        4,
        69,
        43,
        1,
        70,
        44
    ],
    [
        6,
        43,
        19,
        2,
        44,
        20
    ],
    [
        6,
        43,
        15,
        2,
        44,
        16
    ],
    [
        4,
        101,
        81
    ],
    [
        1,
        80,
        50,
        4,
        81,
        51
    ],
    [
        4,
        50,
        22,
        4,
        51,
        23
    ],
    [
        3,
        36,
        12,
        8,
        37,
        13
    ],
    [
        2,
        116,
        92,
        2,
        117,
        93
    ],
    [
        6,
        58,
        36,
        2,
        59,
        37
    ],
    [
        4,
        46,
        20,
        6,
        47,
        21
    ],
    [
        7,
        42,
        14,
        4,
        43,
        15
    ],
    [
        4,
        133,
        107
    ],
    [
        8,
        59,
        37,
        1,
        60,
        38
    ],
    [
        8,
        44,
        20,
        4,
        45,
        21
    ],
    [
        12,
        33,
        11,
        4,
        34,
        12
    ],
    [
        3,
        145,
        115,
        1,
        146,
        116
    ],
    [
        4,
        64,
        40,
        5,
        65,
        41
    ],
    [
        11,
        36,
        16,
        5,
        37,
        17
    ],
    [
        11,
        36,
        12,
        5,
        37,
        13
    ],
    [
        5,
        109,
        87,
        1,
        110,
        88
    ],
    [
        5,
        65,
        41,
        5,
        66,
        42
    ],
    [
        5,
        54,
        24,
        7,
        55,
        25
    ],
    [
        11,
        36,
        12,
        7,
        37,
        13
    ],
    [
        5,
        122,
        98,
        1,
        123,
        99
    ],
    [
        7,
        73,
        45,
        3,
        74,
        46
    ],
    [
        15,
        43,
        19,
        2,
        44,
        20
    ],
    [
        3,
        45,
        15,
        13,
        46,
        16
    ],
    [
        1,
        135,
        107,
        5,
        136,
        108
    ],
    [
        10,
        74,
        46,
        1,
        75,
        47
    ],
    [
        1,
        50,
        22,
        15,
        51,
        23
    ],
    [
        2,
        42,
        14,
        17,
        43,
        15
    ],
    [
        5,
        150,
        120,
        1,
        151,
        121
    ],
    [
        9,
        69,
        43,
        4,
        70,
        44
    ],
    [
        17,
        50,
        22,
        1,
        51,
        23
    ],
    [
        2,
        42,
        14,
        19,
        43,
        15
    ],
    [
        3,
        141,
        113,
        4,
        142,
        114
    ],
    [
        3,
        70,
        44,
        11,
        71,
        45
    ],
    [
        17,
        47,
        21,
        4,
        48,
        22
    ],
    [
        9,
        39,
        13,
        16,
        40,
        14
    ],
    [
        3,
        135,
        107,
        5,
        136,
        108
    ],
    [
        3,
        67,
        41,
        13,
        68,
        42
    ],
    [
        15,
        54,
        24,
        5,
        55,
        25
    ],
    [
        15,
        43,
        15,
        10,
        44,
        16
    ],
    [
        4,
        144,
        116,
        4,
        145,
        117
    ],
    [
        17,
        68,
        42
    ],
    [
        17,
        50,
        22,
        6,
        51,
        23
    ],
    [
        19,
        46,
        16,
        6,
        47,
        17
    ],
    [
        2,
        139,
        111,
        7,
        140,
        112
    ],
    [
        17,
        74,
        46
    ],
    [
        7,
        54,
        24,
        16,
        55,
        25
    ],
    [
        34,
        37,
        13
    ],
    [
        4,
        151,
        121,
        5,
        152,
        122
    ],
    [
        4,
        75,
        47,
        14,
        76,
        48
    ],
    [
        11,
        54,
        24,
        14,
        55,
        25
    ],
    [
        16,
        45,
        15,
        14,
        46,
        16
    ],
    [
        6,
        147,
        117,
        4,
        148,
        118
    ],
    [
        6,
        73,
        45,
        14,
        74,
        46
    ],
    [
        11,
        54,
        24,
        16,
        55,
        25
    ],
    [
        30,
        46,
        16,
        2,
        47,
        17
    ],
    [
        8,
        132,
        106,
        4,
        133,
        107
    ],
    [
        8,
        75,
        47,
        13,
        76,
        48
    ],
    [
        7,
        54,
        24,
        22,
        55,
        25
    ],
    [
        22,
        45,
        15,
        13,
        46,
        16
    ],
    [
        10,
        142,
        114,
        2,
        143,
        115
    ],
    [
        19,
        74,
        46,
        4,
        75,
        47
    ],
    [
        28,
        50,
        22,
        6,
        51,
        23
    ],
    [
        33,
        46,
        16,
        4,
        47,
        17
    ],
    [
        8,
        152,
        122,
        4,
        153,
        123
    ],
    [
        22,
        73,
        45,
        3,
        74,
        46
    ],
    [
        8,
        53,
        23,
        26,
        54,
        24
    ],
    [
        12,
        45,
        15,
        28,
        46,
        16
    ],
    [
        3,
        147,
        117,
        10,
        148,
        118
    ],
    [
        3,
        73,
        45,
        23,
        74,
        46
    ],
    [
        4,
        54,
        24,
        31,
        55,
        25
    ],
    [
        11,
        45,
        15,
        31,
        46,
        16
    ],
    [
        7,
        146,
        116,
        7,
        147,
        117
    ],
    [
        21,
        73,
        45,
        7,
        74,
        46
    ],
    [
        1,
        53,
        23,
        37,
        54,
        24
    ],
    [
        19,
        45,
        15,
        26,
        46,
        16
    ],
    [
        5,
        145,
        115,
        10,
        146,
        116
    ],
    [
        19,
        75,
        47,
        10,
        76,
        48
    ],
    [
        15,
        54,
        24,
        25,
        55,
        25
    ],
    [
        23,
        45,
        15,
        25,
        46,
        16
    ],
    [
        13,
        145,
        115,
        3,
        146,
        116
    ],
    [
        2,
        74,
        46,
        29,
        75,
        47
    ],
    [
        42,
        54,
        24,
        1,
        55,
        25
    ],
    [
        23,
        45,
        15,
        28,
        46,
        16
    ],
    [
        17,
        145,
        115
    ],
    [
        10,
        74,
        46,
        23,
        75,
        47
    ],
    [
        10,
        54,
        24,
        35,
        55,
        25
    ],
    [
        19,
        45,
        15,
        35,
        46,
        16
    ],
    [
        17,
        145,
        115,
        1,
        146,
        116
    ],
    [
        14,
        74,
        46,
        21,
        75,
        47
    ],
    [
        29,
        54,
        24,
        19,
        55,
        25
    ],
    [
        11,
        45,
        15,
        46,
        46,
        16
    ],
    [
        13,
        145,
        115,
        6,
        146,
        116
    ],
    [
        14,
        74,
        46,
        23,
        75,
        47
    ],
    [
        44,
        54,
        24,
        7,
        55,
        25
    ],
    [
        59,
        46,
        16,
        1,
        47,
        17
    ],
    [
        12,
        151,
        121,
        7,
        152,
        122
    ],
    [
        12,
        75,
        47,
        26,
        76,
        48
    ],
    [
        39,
        54,
        24,
        14,
        55,
        25
    ],
    [
        22,
        45,
        15,
        41,
        46,
        16
    ],
    [
        6,
        151,
        121,
        14,
        152,
        122
    ],
    [
        6,
        75,
        47,
        34,
        76,
        48
    ],
    [
        46,
        54,
        24,
        10,
        55,
        25
    ],
    [
        2,
        45,
        15,
        64,
        46,
        16
    ],
    [
        17,
        152,
        122,
        4,
        153,
        123
    ],
    [
        29,
        74,
        46,
        14,
        75,
        47
    ],
    [
        49,
        54,
        24,
        10,
        55,
        25
    ],
    [
        24,
        45,
        15,
        46,
        46,
        16
    ],
    [
        4,
        152,
        122,
        18,
        153,
        123
    ],
    [
        13,
        74,
        46,
        32,
        75,
        47
    ],
    [
        48,
        54,
        24,
        14,
        55,
        25
    ],
    [
        42,
        45,
        15,
        32,
        46,
        16
    ],
    [
        20,
        147,
        117,
        4,
        148,
        118
    ],
    [
        40,
        75,
        47,
        7,
        76,
        48
    ],
    [
        43,
        54,
        24,
        22,
        55,
        25
    ],
    [
        10,
        45,
        15,
        67,
        46,
        16
    ],
    [
        19,
        148,
        118,
        6,
        149,
        119
    ],
    [
        18,
        75,
        47,
        31,
        76,
        48
    ],
    [
        34,
        54,
        24,
        34,
        55,
        25
    ],
    [
        20,
        45,
        15,
        61,
        46,
        16
    ]
]);
function qr_generator_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class QRCodeGenerator {
    addData(data) {
        const newData = new QR8BitByte(data);
        this.dataList.push(newData);
        this.dataCache = null;
    }
    isDark(row, col) {
        if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) throw new Error(`${row},${col}`);
        return this.modules[row][col];
    }
    getModuleCount() {
        return this.moduleCount;
    }
    make() {
        this.makeImpl(false, this.getBestMaskPattern());
    }
    makeImpl(test, maskPattern) {
        this.moduleCount = 4 * this.typeNumber + 17;
        this.modules = this.createModules(this.moduleCount);
        this.setupPositionProbePattern(0, 0);
        this.setupPositionProbePattern(this.moduleCount - 7, 0);
        this.setupPositionProbePattern(0, this.moduleCount - 7);
        this.setupPositionAdjustPattern();
        this.setupTimingPattern();
        this.setupTypeInfo(test, maskPattern);
        if (this.typeNumber >= 7) this.setupTypeNumber(test);
        if (null == this.dataCache) this.dataCache = this.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
        this.mapData(this.dataCache, maskPattern);
    }
    createModules(moduleCount) {
        const modules = new Array(moduleCount);
        for(let row = 0; row < moduleCount; row += 1){
            modules[row] = new Array(moduleCount);
            for(let col = 0; col < moduleCount; col += 1)modules[row][col] = null;
        }
        return modules;
    }
    setupPositionProbePattern(row, col) {
        for(let r = -1; r <= 7; r += 1)if (!(row + r <= -1) && !(this.moduleCount <= row + r)) {
            for(let c = -1; c <= 7; c += 1)if (!(col + c <= -1) && !(this.moduleCount <= col + c)) if (0 <= r && r <= 6 && (0 == c || 6 == c) || 0 <= c && c <= 6 && (0 == r || 6 == r) || 2 <= r && r <= 4 && 2 <= c && c <= 4) this.modules[row + r][col + c] = true;
            else this.modules[row + r][col + c] = false;
        }
    }
    getBestMaskPattern() {
        let minLostPoint = 0;
        let pattern = 0;
        for(let i = 0; i < 8; i += 1){
            this.makeImpl(true, i);
            const lostPoint = QRUtil.getLostPoint(this);
            if (0 == i || minLostPoint > lostPoint) {
                minLostPoint = lostPoint;
                pattern = i;
            }
        }
        return pattern;
    }
    setupTimingPattern() {
        for(let r = 8; r < this.moduleCount - 8; r += 1)if (null == this.modules[r][6]) this.modules[r][6] = r % 2 == 0;
        for(let c = 8; c < this.moduleCount - 8; c += 1)if (null == this.modules[6][c]) this.modules[6][c] = c % 2 == 0;
    }
    setupPositionAdjustPattern() {
        const pos = QRUtil.getPatternPosition(this.typeNumber);
        for(let i = 0; i < pos.length; i += 1)for(let j = 0; j < pos.length; j += 1){
            const row = pos[i];
            const col = pos[j];
            if (null == this.modules[row][col]) for(let r = -2; r <= 2; r += 1)for(let c = -2; c <= 2; c += 1)this.modules[row + r][col + c] = -2 == r || 2 == r || -2 == c || 2 == c || 0 == r && 0 == c;
        }
    }
    setupTypeNumber(test) {
        const bits = QRUtil.getBCHTypeNumber(this.typeNumber);
        for(let i = 0; i < 18; i += 1){
            const mod = !test && (bits >> i & 1) == 1;
            this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
        }
        for(let i = 0; i < 18; i += 1){
            const mod = !test && (bits >> i & 1) == 1;
            this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
        }
    }
    setupTypeInfo(test, maskPattern) {
        const data = this.errorCorrectLevel << 3 | maskPattern;
        const bits = QRUtil.getBCHTypeInfo(data);
        for(let i = 0; i < 15; i += 1){
            const mod = !test && (bits >> i & 1) == 1;
            this.modules[i < 6 ? i : i < 8 ? i + 1 : this.moduleCount - 15 + i][8] = mod;
            this.modules[8][i < 8 ? this.moduleCount - i - 1 : i < 9 ? 15 - i : 14 - i] = mod;
        }
        this.modules[this.moduleCount - 8][8] = !test;
    }
    mapData(data, maskPattern) {
        let inc = -1;
        let row = this.moduleCount - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        const maskFunc = QRUtil.getMaskFunction(maskPattern);
        for(let col = this.moduleCount - 1; col > 0; col -= 2){
            if (6 == col) col -= 1;
            while(true){
                for(let c = 0; c < 2; c += 1)if (null == this.modules[row][col - c]) {
                    let dark = false;
                    if (byteIndex < data.length) dark = (data[byteIndex] >>> bitIndex & 1) == 1;
                    const mask = maskFunc(row, col - c);
                    if (mask) dark = !dark;
                    this.modules[row][col - c] = dark;
                    bitIndex -= 1;
                    if (-1 == bitIndex) {
                        byteIndex += 1;
                        bitIndex = 7;
                    }
                }
                row += inc;
                if (row < 0 || this.moduleCount <= row) {
                    row -= inc;
                    inc = -inc;
                    break;
                }
            }
        }
    }
    createBytes(buffer, rsBlocks) {
        let offset = 0;
        let maxDcCount = 0;
        let maxEcCount = 0;
        const dcdata = new Array(rsBlocks.length);
        const ecdata = new Array(rsBlocks.length);
        for(let r = 0; r < rsBlocks.length; r += 1){
            const dcCount = rsBlocks[r].dataCount;
            const ecCount = rsBlocks[r].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount);
            maxEcCount = Math.max(maxEcCount, ecCount);
            dcdata[r] = new Array(dcCount);
            for(let i = 0; i < dcdata[r].length; i += 1)dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
            offset += dcCount;
            const rsPoly = this.getErrorCorrectPolynomial(ecCount);
            const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
            const modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for(let i = 0; i < ecdata[r].length; i += 1){
                const modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = modIndex >= 0 ? modPoly.getAt(modIndex) : 0;
            }
        }
        let totalCodeCount = 0;
        for(let i = 0; i < rsBlocks.length; i += 1)totalCodeCount += rsBlocks[i].totalCount;
        const data = new Array(totalCodeCount);
        let index = 0;
        for(let i = 0; i < maxDcCount; i += 1)for(let r = 0; r < rsBlocks.length; r += 1)if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
        }
        for(let i = 0; i < maxEcCount; i += 1)for(let r = 0; r < rsBlocks.length; r += 1)if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
        }
        return data;
    }
    getErrorCorrectPolynomial(errorCorrectLength) {
        let a = new QRPolynomial([
            1
        ], 0);
        for(let i = 0; i < errorCorrectLength; i += 1)a = a.multiply(new QRPolynomial([
            1,
            QRMath.gexp(i)
        ], 0));
        return a;
    }
    createData(typeNumber, errorCorrectLevel, dataList) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
        const buffer = new QRBitBuffer();
        for(let i = 0; i < dataList.length; i += 1){
            const data = dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber));
            data.write(buffer);
        }
        let totalDataCount = 0;
        for(let i = 0; i < rsBlocks.length; i += 1)totalDataCount += rsBlocks[i].dataCount;
        if (buffer.getLengthInBits() > 8 * totalDataCount) throw new Error('code length overflow. (' + buffer.getLengthInBits() + '>' + 8 * totalDataCount + ')');
        if (buffer.getLengthInBits() + 4 <= 8 * totalDataCount) buffer.put(0, 4);
        while(buffer.getLengthInBits() % 8 != 0)buffer.putBit(false);
        while(true){
            if (buffer.getLengthInBits() >= 8 * totalDataCount) break;
            buffer.put(0xec, 8);
            if (buffer.getLengthInBits() >= 8 * totalDataCount) break;
            buffer.put(0x11, 8);
        }
        return this.createBytes(buffer, rsBlocks);
    }
    static stringToBytes(s) {
        function toUTF8Array(str) {
            const utf8 = [];
            for(let i = 0; i < str.length; i++){
                const charcode = str.charCodeAt(i);
                if (charcode < 0x80) utf8.push(charcode);
                else if (charcode < 0x800) utf8.push(0xc0 | charcode >> 6, 0x80 | 0x3f & charcode);
                else if (charcode < 0xd800 || charcode >= 0xe000) utf8.push(0xe0 | charcode >> 12, 0x80 | charcode >> 6 & 0x3f, 0x80 | 0x3f & charcode);
                else {
                    i++;
                    const charcode2 = 0x10000 + ((0x3ff & charcode) << 10 | 0x3ff & str.charCodeAt(i));
                    utf8.push(0xf0 | charcode2 >> 18, 0x80 | charcode2 >> 12 & 0x3f, 0x80 | charcode2 >> 6 & 0x3f, 0x80 | 0x3f & charcode2);
                }
            }
            return utf8;
        }
        return toUTF8Array(s);
    }
    constructor(typeNumber, errorCorrectLevel){
        qr_generator_define_property(this, "typeNumber", void 0);
        qr_generator_define_property(this, "errorCorrectLevel", void 0);
        qr_generator_define_property(this, "modules", null);
        qr_generator_define_property(this, "moduleCount", 0);
        qr_generator_define_property(this, "dataCache", null);
        qr_generator_define_property(this, "dataList", []);
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = QRErrorCorrectLevel[errorCorrectLevel];
    }
}
class QR8BitByte {
    getMode() {
        return this.mode;
    }
    getLength() {
        return this.bytes.length;
    }
    write(buffer) {
        for(let i = 0; i < this.bytes.length; i += 1)buffer.put(this.bytes[i], 8);
    }
    constructor(data){
        qr_generator_define_property(this, "mode", void 0);
        qr_generator_define_property(this, "data", void 0);
        qr_generator_define_property(this, "bytes", void 0);
        this.mode = QRMode.MODE_8BIT_BYTE;
        this.data = data;
        this.bytes = QRCodeGenerator.stringToBytes(data);
    }
}
class QRBitBuffer {
    getBuffer() {
        return this.buffer;
    }
    getAt(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
    }
    put(num, length) {
        for(let i = 0; i < length; i += 1)this.putBit((num >>> length - i - 1 & 1) == 1);
    }
    getLengthInBits() {
        return this.length;
    }
    putBit(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) this.buffer.push(0);
        if (bit) this.buffer[bufIndex] |= 0x80 >>> this.length % 8;
        this.length += 1;
    }
    constructor(){
        qr_generator_define_property(this, "buffer", []);
        qr_generator_define_property(this, "length", 0);
    }
}
class QRPolynomial {
    getAt(index) {
        return this.num[index];
    }
    getLength() {
        return this.num.length;
    }
    multiply(e) {
        const num = new Array(this.getLength() + e.getLength() - 1);
        for(let i = 0; i < this.getLength(); i += 1)for(let j = 0; j < e.getLength(); j += 1)num[i + j] ^= QRMath.gexp(QRMath.glog(this.getAt(i)) + QRMath.glog(e.getAt(j)));
        return new QRPolynomial(num, 0);
    }
    mod(e) {
        if (this.getLength() - e.getLength() < 0) return this;
        const ratio = QRMath.glog(this.getAt(0)) - QRMath.glog(e.getAt(0));
        const num = new Array(this.getLength());
        for(let i = 0; i < this.getLength(); i += 1)num[i] = this.getAt(i);
        for(let i = 0; i < e.getLength(); i += 1)num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i)) + ratio);
        return new QRPolynomial(num, 0).mod(e);
    }
    constructor(num, shift){
        qr_generator_define_property(this, "num", void 0);
        if (void 0 === num.length) throw new Error(num.length + '/' + shift);
        const offset = (()=>{
            let offset = 0;
            while(offset < num.length && 0 == num[offset])offset += 1;
            return offset;
        })();
        this.num = new Array(num.length - offset + shift);
        for(let i = 0; i < num.length - offset; i += 1)this.num[i] = num[i + offset];
    }
}
const QRMode = {
    MODE_8BIT_BYTE: 4
};
const QRErrorCorrectLevel = {
    L: 1,
    M: 0,
    Q: 3,
    H: 2
};
function toKebab(str) {
    return str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (s, ofs)=>(ofs ? '-' : '') + s.toLowerCase());
}
function render(style) {
    let s = '';
    Object.entries(style).forEach(([k, v])=>s += `${toKebab(k)}:${v};`);
    return s;
}
function utils_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
var utils_logLevel = /*#__PURE__*/ function(logLevel) {
    logLevel[logLevel["none"] = -1] = "none";
    logLevel[logLevel["error"] = 0] = "error";
    logLevel[logLevel["warn"] = 1] = "warn";
    logLevel[logLevel["info"] = 2] = "info";
    logLevel[logLevel["debug"] = 3] = "debug";
    logLevel[logLevel["trace"] = 4] = "trace";
    return logLevel;
}({});
class utils_logger {
    error(...args) {
        if (this.level >= 0) console.error(`[corvid] ${this.prefix}`, ...args);
    }
    warn(...args) {
        if (this.level >= 1) console.warn(`[corvid] ${this.prefix}`, ...args);
    }
    info(...args) {
        if (this.level >= 2) console.info(`[corvid] ${this.prefix}`, ...args);
    }
    debug(...args) {
        if (this.level >= 3) console.debug(`[corvid] ${this.prefix}`, ...args);
    }
    trace(...args) {
        if (this.level >= 4) console.trace(`[corvid] ${this.prefix}`, ...args);
    }
    log(...args) {
        console.log(`[corvid] ${this.prefix}`, ...args);
    }
    constructor(level = 2, prefix){
        utils_define_property(this, "level", void 0);
        utils_define_property(this, "prefix", void 0);
        this.level = level;
        this.prefix = prefix ? `(${prefix}):` : ':';
        if (-1 === this.level) [
            'error',
            'warn',
            'info',
            'debug',
            'trace',
            'log'
        ].forEach((methodName)=>{
            this[methodName] = ()=>{};
        });
    }
}
function dom_define_property(obj, key, value) {
    if (key in obj) Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
    });
    else obj[key] = value;
    return obj;
}
class dom_el {
    static query(query, verbose = false) {
        return new dom_el(query, verbose);
    }
    value(update) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (void 0 !== update) {
            if ('value' in this.el) this.el.value = update;
            if ('src' in this.el) this.el.src = update;
            return this;
        }
        if ('value' in this.el) return this.el.value;
        if ('innerText' in this.el) return this.el.innerText;
        if ('innerHTML' in this.el) return this.el.innerHTML;
        this.log.warn(`element (${this.query}) does not contain value, returning empty string`);
        return '';
    }
    parent(parent) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        parent.appendChild(this.el);
        return this;
    }
    appendChild(ch) {
        return this.child(ch);
    }
    child(ch) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (ch instanceof dom_el) this.el.appendChild(ch.el);
        else this.el.appendChild(ch);
        return this;
    }
    prependChild(ch) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (ch instanceof dom_el) this.el.prepend(ch.el);
        else this.el.prepend(ch);
        return this;
    }
    empty() {
        if (this.el) this.el.innerHTML = '';
        return this;
    }
    content(content, { text = false } = {}) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (text) this.el.textContent = content;
        else this.el.innerHTML = content;
        return this;
    }
    src(url) {
        if (this.el && 'src' in this.el) this.el.src = url;
        return this;
    }
    style(update, stringify = false) {
        if (this.el) {
            if ('string' == typeof update) this.el.style = update;
            else if ('object' == typeof update) {
                if (!stringify) {
                    for (const [k, v] of Object.entries(update))this.el.style[k] = v;
                    return;
                }
                const s = render(update);
                this.log.debug(`set style: ${this.el.style} -> ${s}`);
                this.el.style = s;
            }
        }
        return this;
    }
    hasClass(className) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        return this.el.classList.contains(className);
    }
    addClass(className) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if ('string' == typeof className) this.el.classList.add(className);
        else for (const sc of className)this.el.classList.add(sc);
        return this;
    }
    removeClass(className) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if ('string' == typeof className) this.el.classList.remove(className);
        else for (const sc of className)this.el.classList.remove(sc);
        return this;
    }
    html(content) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        this.el.innerHTML = content;
    }
    render(vars = {}) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        try {
            return interpolate(this.el.innerHTML, vars);
        } catch (e) {
            throw new Error(`could not render template ${this.query}: ${e}`);
        }
    }
    appendTemplate(template, vars) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (!template.el) throw new Error("template does not contain element");
        const tmpl = template.render(vars);
        this.el.insertAdjacentHTML('beforeend', tmpl);
    }
    on(event, cb) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
        this.el.addEventListener(event, cb);
        return this;
    }
    listen(event, cb) {
        return this.on(event, cb);
    }
    removeListeners(event) {
        if (!this.el) throw new Error(`no element from query: ${this.query}`);
        if (!this.listeners[event]) return this;
        for (const cb of this.listeners[event])this.el.removeEventListener(event, cb);
        this.listeners[event] = [];
        return this;
    }
    constructor(opts, verbose = false){
        dom_define_property(this, "el", void 0);
        dom_define_property(this, "query", '');
        dom_define_property(this, "log", void 0);
        dom_define_property(this, "listeners", {});
        this.log = new utils_logger(verbose ? utils_logLevel.debug : utils_logLevel.none, 'element');
        if ('string' == typeof opts) {
            this.query = opts;
            this.el = document.querySelector(opts);
            return;
        }
        if (opts instanceof HTMLElement) {
            this.log.debug(`using existing element: ${opts}`);
            this.el = opts;
            return;
        }
        const { query, element, type, class: styleClass, style, id, content, parent } = opts;
        if (query) {
            this.log.debug(`using query: ${query}`);
            this.query = query;
            this.el = document.querySelector(query);
            if (!this.el) throw new Error(`no element from query: ${query}`);
        } else if (element) {
            this.log.debug(`using existing element: ${element}`);
            this.el = element;
        } else if (type) {
            this.query = type;
            this.log.debug(`creating element: ${type}`);
            this.el = document.createElement(type);
        } else throw new Error('no query or type provided');
        if (this.el) {
            if (id) {
                this.log.debug(`setting id: ${id}`);
                this.el.id = id;
            }
            if (styleClass) if ('string' == typeof styleClass) this.el.classList.add(styleClass);
            else for (const sc of styleClass)this.el.classList.add(sc);
            if (style) this.style(style);
            if (content) {
                this.log.debug(`setting content: ${content}`);
                this.el.innerHTML = content;
            }
            if (parent) {
                this.log.debug("adding to parent");
                parent.appendChild(this.el);
            }
        }
    }
}
function interpolate(str, params) {
    let names = Object.keys(params).map((k)=>`_${k}`);
    let vals = Object.values(params);
    return new Function(...names, `return \`${str.replace(/\$\{(\w*)\}/g, '${_$1}')}\`;`)(...vals);
}
class QR {
    static render(config, element) {
        const settings = this.getDefaultSettings(config);
        if (element instanceof HTMLCanvasElement) this.renderToCanvas(element, settings);
        else {
            if (element instanceof dom_el) element = element.el;
            const canvas = this.createCanvas(settings);
            element.appendChild(canvas);
        }
    }
    static getDefaultSettings(config) {
        return {
            minVersion: 1,
            maxVersion: 40,
            ecLevel: 'L',
            left: 0,
            top: 0,
            size: 200,
            fill: '#000',
            background: null,
            radius: 0.5,
            quiet: 0,
            ...config
        };
    }
    static createQRCode(text, level, version, quiet) {
        try {
            const qr = new QRCodeGenerator(version, level);
            qr.addData(text);
            qr.make();
            const qrModuleCount = qr.getModuleCount();
            const quietModuleCount = qrModuleCount + 2 * quiet;
            const isDark = (row, col)=>{
                row -= quiet;
                col -= quiet;
                if (row < 0 || row >= qrModuleCount || col < 0 || col >= qrModuleCount) return false;
                return qr.isDark(row, col);
            };
            return {
                text,
                level,
                version,
                moduleCount: quietModuleCount,
                isDark
            };
        } catch  {
            return null;
        }
    }
    static createMinQRCode(text, level, minVersion, maxVersion, quiet) {
        minVersion = Math.max(1, minVersion);
        maxVersion = Math.min(40, maxVersion);
        for(let version = minVersion; version <= maxVersion; version++){
            const qr = this.createQRCode(text, level, version, quiet);
            if (qr) return qr;
        }
        return null;
    }
    static drawBackground(qr, context, settings) {
        if (settings.background) {
            context.fillStyle = settings.background;
            context.fillRect(settings.left, settings.top, settings.size, settings.size);
        }
    }
    static drawModuleRoundedDark(ctx, l, t, r, b, rad, nw, ne, se, sw) {
        if (nw) ctx.moveTo(l + rad, t);
        else ctx.moveTo(l, t);
        const lal = (b, x0, y0, x1, y1, r0, r1)=>{
            if (b) {
                ctx.lineTo(x0 + r0, y0 + r1);
                ctx.arcTo(x0, y0, x1, y1, rad);
            } else ctx.lineTo(x0, y0);
        };
        lal(ne, r, t, r, b, -rad, 0);
        lal(se, r, b, l, b, 0, -rad);
        lal(sw, l, b, l, t, rad, 0);
        lal(nw, l, t, r, t, 0, rad);
    }
    static drawModuleRoundedLight(ctx, l, t, r, b, rad, nw, ne, se, sw) {
        const mlla = (x, y, r0, r1)=>{
            ctx.moveTo(x + r0, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + r1);
            ctx.arcTo(x, y, x + r0, y, rad);
        };
        if (nw) mlla(l, t, rad, rad);
        if (ne) mlla(r, t, -rad, rad);
        if (se) mlla(r, b, -rad, -rad);
        if (sw) mlla(l, b, rad, -rad);
    }
    static drawModuleRounded(qr, context, settings, left, top, width, row, col) {
        const isDark = qr.isDark;
        const right = left + width;
        const bottom = top + width;
        const rowT = row - 1;
        const rowB = row + 1;
        const colL = col - 1;
        const colR = col + 1;
        const radius = Math.floor(Math.min(0.5, Math.max(0, settings.radius)) * width);
        const center = isDark(row, col);
        const northwest = isDark(rowT, colL);
        const north = isDark(rowT, col);
        const northeast = isDark(rowT, colR);
        const east = isDark(row, colR);
        const southeast = isDark(rowB, colR);
        const south = isDark(rowB, col);
        const southwest = isDark(rowB, colL);
        const west = isDark(row, colL);
        const leftRounded = Math.round(left);
        const topRounded = Math.round(top);
        const rightRounded = Math.round(right);
        const bottomRounded = Math.round(bottom);
        if (center) this.drawModuleRoundedDark(context, leftRounded, topRounded, rightRounded, bottomRounded, radius, !north && !west, !north && !east, !south && !east, !south && !west);
        else this.drawModuleRoundedLight(context, leftRounded, topRounded, rightRounded, bottomRounded, radius, north && west && northwest, north && east && northeast, south && east && southeast, south && west && southwest);
    }
    static drawModules(qr, context, settings) {
        const moduleCount = qr.moduleCount;
        const moduleSize = settings.size / moduleCount;
        context.beginPath();
        for(let row = 0; row < moduleCount; row++)for(let col = 0; col < moduleCount; col++){
            const l = settings.left + col * moduleSize;
            const t = settings.top + row * moduleSize;
            const w = moduleSize;
            this.drawModuleRounded(qr, context, settings, l, t, w, row, col);
        }
        this.setFill(context, settings);
        context.fill();
    }
    static setFill(context, settings) {
        const fill = settings.fill;
        if ('string' == typeof fill) {
            context.fillStyle = fill;
            return;
        }
        const type = fill.type;
        const position = fill.position;
        const colorStops = fill.colorStops;
        let gradient;
        const absolutePosition = position.map((coordinate)=>Math.round(coordinate * settings.size));
        if ('linear-gradient' === type) gradient = context.createLinearGradient(absolutePosition[0], absolutePosition[1], absolutePosition[2], absolutePosition[3]);
        else if ('radial-gradient' === type) gradient = context.createRadialGradient(absolutePosition[0], absolutePosition[1], absolutePosition[2], absolutePosition[3], absolutePosition[4], absolutePosition[5]);
        else throw new Error('Unsupported fill');
        colorStops.forEach(([offset, color])=>{
            gradient.addColorStop(offset, color);
        });
        context.fillStyle = gradient;
    }
    static drawOnCanvas(canvas, settings) {
        const qr = this.createMinQRCode(settings.text, settings.ecLevel, settings.minVersion, settings.maxVersion, settings.quiet);
        if (!qr) return null;
        const context = canvas.getContext('2d');
        this.drawBackground(qr, context, settings);
        this.drawModules(qr, context, settings);
        return canvas;
    }
    static createCanvas(settings) {
        const canvas = document.createElement('canvas');
        canvas.width = settings.size;
        canvas.height = settings.size;
        return this.drawOnCanvas(canvas, settings) || canvas;
    }
    static renderToCanvas(canvas, settings) {
        if (canvas.width !== settings.size || canvas.height !== settings.size) {
            canvas.width = settings.size;
            canvas.height = settings.size;
        }
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.drawOnCanvas(canvas, settings);
    }
}
const src_qr = QR;
export { QR, src_qr as default };
