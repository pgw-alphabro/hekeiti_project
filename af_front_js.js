var AF_vars = {
	key: "",
	names: "",
	autoForm: "",
	modifyFields: "",
	passFields: "",
	errMsg: "",
	ment1: " 입력하세요.",
	ment2: " 선택하세요.",
	errMsgCustomFunc: null,
	isAllChk: false,
	isAutoFocus: true,
	preset: function (presetName, callBackFunc) {
		if (presetName == "chkAll") {
			this.isAllChk = true;
			this.isAutoFocus = false;
			if (typeof callBackFunc != "undefined")
				this.errMsgCustomFunc = callBackFunc;
		}
	},
};
var AF_util = {
	frm: null,
	field: null,
	types: null,
	msg: null,
	chk: new Array(),
	splitText: ", ",
	showError: true,
	init: function (val1, val2) {
		this.frm = AF_util.getForm(val1);
		if (this.frm == null) return;
		if (val2 != null) {
			this.setField(val2);
			if (this.field == null) return;
		}
	},
	getValue: function (v) {
		var ret = "";
		if (v != null) this.setField(v);
		if (this.field == null) return null;
		this.getType();
		if (this.field.length > 0 && this.types != "select-one") {
			var aTmp = new Array();
			for (var i = 0; i < this.field.length; i++) {
				if (this.types == "radio" || this.types == "checkbox") {
					if (this.field[i].checked) {
						aTmp.push(this.field[i].value);
					}
				} else {
					ret += this.field[i].value + this.splitText;
				}
			}
			if (this.types == "radio" || this.types == "checkbox") {
				ret = aTmp;
			} else {
				var reg = eval("/" + this.splitText + "$/g");
				ret = ret.replace(reg, "");
			}
		} else {
			if (this.types == "radio" || this.types == "checkbox") {
				if (this.field.checked) ret = this.field.value;
			} else {
				if (this.types == "select-one") {
					if (this.field.selectedIndex == -1) ret = "";
					else {
						ret = this.field.options[this.field.selectedIndex].getAttribute(
							"value"
						);
						if (ret == null) ret = "";
					}
				} else {
					ret = this.field.value;
				}
			}
		}
		return ret;
	},
	getValues: function (val) {
		var tmp = "";
		var aTmp = new Array();
		var aVal = val.replace(/( )*,( )*/g, ",").split(",");
		for (var i = 0; i < aVal.length; i++) {
			tmp = this.getValue(aVal[i]);
			if (tmp != "") aTmp.push(tmp);
		}
		return aTmp;
	},
	getObject: function (v) {
		if (v != null) this.setField(v);
		return this.field;
	},
	getType: function (v) {
		if (v != null) this.setField(v);
		if (this.field.length > 1 && this.field.type != "select-one") {
			this.types = this.field[0].type;
			return this.types;
		} else {
			this.types = this.field.type;
			return this.types;
		}
	},
	setValue: function (v, v1) {
		var o = this.getObject(v);
		var types = this.getType();
		if (types == "radio" && o.length > 0) {
			for (var i = 0; i < o.length; i++)
				if (o[i].value == v1) o[i].checked = true;
		} else o.value = v1;
	},
	setField: function (f) {
		if (typeof f == "string") {
			this.field = this.frm.elements[f];
			if (f.match(/.+\[[0-9]+\]$/gi)) {
				var names = f.replace(/\[[0-9]+\]$/gi, "");
				var indexs = f.replace(/^.+\[|]$/gi, "");
				if (
					this.frm.elements[names].length > 0 &&
					this.frm.elements[names].type != "select-one"
				) {
					this.field = this.frm.elements[names][indexs];
				} else {
					this.field = this.frm.elements[names];
				}
			}
		} else if (typeof f == "object") {
			this.field = f;
		}
		if (typeof this.field != "object") {
			this.field = null;
			if (this.showError) {
				alert("AF_util.setField : 지정한 [ " + f + " ] 필드가 없습니다");
				this.field = null;
				this.showError = true;
			}
		}
	},
	getCount: function (f) {
		if (f != null) this.setField(f);
		if (this.field.length > 1 && this.field.type != "select-one") {
			return this.field.length;
		} else {
			return 1;
		}
	},
	getIndex: function (f) {
		var tmpObj = this.getObject(f);
		this.setField(f.name);
		var cnt = this.getCount();
		if (cnt == 1) {
			return 0;
		} else {
			for (var i = 0; i < cnt; i++) {
				if (this.field[i] == tmpObj) {
					return i;
				}
			}
		}
	},
	comboClear: function (n) {
		var tmp = this.field.options.length;
		if (typeof n == "number") tmp = tmp + n;
		for (var i = 0; i < tmp; i++)
			this.field.remove(this.field.options.length - 1);
		this.field.selectedIndex = 0;
	},
	comboAdd: function (val, txt, sel) {
		var op = new Option();
		op.value = val;
		op.text = txt;
		if (sel != null && val == sel) op.selected = true;
		this.field.options.add(op);
	},
	checkAll: function (bool, val) {
		try {
			if (val != null) this.setField(val);
			var tmp = this.getLen();
			if (tmp == 0) this.field.checked = bool;
			else {
				for (var i = 0; i < tmp; i++) {
					this.field[i].checked = bool;
				}
			}
		} catch (e) {}
	},
	selectAll: function (bool, val) {
		try {
			if (val != null) {
				this.setField(val);
			}
			var tmp = this.getLen();
			for (var i = 0; i < tmp; i++) {
				this.field[i].selected = bool;
			}
		} catch (e) {}
	},
	checkCnt: function (bool, val) {
		if (val != null) {
			this.setField(val);
		}
		var cnt = 0;
		var tmp = this.getLen();
		if (tmp == 0) {
			if (this.field.checked == bool) cnt++;
		} else {
			for (var i = 0; i < tmp; i++) {
				if (this.field[i].checked == bool) cnt++;
			}
		}
		return cnt;
	},
	getForm: function (val) {
		var tmp;
		if (typeof val == "string") {
			tmp = document.forms[val];
		} else if (typeof val == "object") {
			tmp = val;
		}
		if (typeof tmp == "object" && tmp.tagName == "FORM") {
			return tmp;
		} else {
			alert("AF_util.getForm : 지정한 form 이 없습니다");
			return null;
		}
	},
	getEval: function (val) {
		var tmp = val;
		tmp = tmp.replace(
			/{{([a-z0-9_\[\]]+)}}\s*=\s*([^=]+)/,
			"AF_util.setValue('$1', $2)"
		);
		tmp = tmp.replace(/{{([a-z0-9_\[\]]+)}}/gi, "AF_util.getValue('$1')");
		tmp = tmp.replace(/{([a-z0-9_\[\]]+)}/gi, "AF_util.getObject('$1')");
		tmp = tmp.replace(/this\./gi, "obj.");
		tmp = tmp.replace(/\(this\)/gi, "(obj)");
		return tmp;
	},
	getLen: function () {
		if (this.field.length > 0) return this.field.length;
		else return 0;
	},
	getCharLen: function (val, mode) {
		var ch = "";
		var bytes = 0;
		for (var i = 0; i < val.length; i++) {
			ch = val.charAt(i);
			if (mode == "han" && escape(ch).length > 4) {
				bytes += 2;
			} else if (ch == "\n") {
				bytes += 1;
			} else {
				bytes += 1;
			}
		}
		return bytes;
	},
	haveBlank: function (v) {
		var tmp = v;
		if (tmp.match(/ |　/g)) return true;
		else return false;
	},
	removeHan: function (v) {
		return v.replace(/[ㄱ-힣]| /g, "");
	},
	removeEng: function (v) {
		return v.replace(/[a-z]| /gi, "");
	},
	removeBlank: function (v) {
		return v.replace(/\s|　/gi, "");
	},
	isEmpty: function (v) {
		var tmp = this.removeBlank(v);
		if (tmp == "") return true;
		else return false;
	},
	isNum: function (v) {
		var tmp = v.replace(/[0-9]/g, "");
		if (tmp == "") return true;
		else return false;
	},
	isHan: function (v) {
		var tmp = this.removeHan(v);
		if (tmp == "") return true;
		else return false;
	},
	isEng: function (v) {
		var tmp = this.removeEng(v);
		if (tmp == "") return true;
		else return false;
	},
};

function AF_srch_key(srch) {
	var tmp = eval("/" + srch + "/gi");
	if (srch == "" && AF_util.chk[0] == "") return true;
	else if (srch != "") {
		for (var i = 0; i < AF_util.chk.length; i++) {
			if (AF_util.chk[i].replace(/ /g, "").match(tmp)) {
				AF_vars.key = AF_util.chk[i];
				return true;
				break;
			}
		}
	}
	return false;
}

function AF_set_chkArr(v) {
	if (!v.match(/\|/g)) v += "|xx";
	var tmp = v.split("|");
	AF_util.msg = tmp[1];
	if (!tmp[0].match(/,/g)) tmp[0] += ",";
	tmp[0] = tmp[0].replace(/,$/g, "");
	AF_util.chk = tmp[0].split(",");
}

function AF_check(targetForm, isAllChk) {
	if (typeof isAllChk != "undefined") AF_vars.isAllChk = isAllChk;
	var frm = AF_util.getForm(targetForm);
	if (frm == null) return false;
	AF_util.init(frm);
	AF_vars.errMsg = "";
	var check = true;
	var chk1 = 0;
	var chk2 = 0;
	var chkString = "";
	var focusElements = "";
	var isContinue = true;
	var isOk = "Y";
	var names = "";
	var passFields = "," + AF_vars.passFields.replace(/ /gi, "") + ",";
	var tmp1 = "";
	var tmp2 = "";
	var tmp3 = "";
	var tmpArr = new Array();
	var types = "";
	var values = "";
	var ifmode = "";
	var obj;
	for (var i = 0; i < frm.length; i++) {
		focusElements = "";
		obj = frm.elements[i];
		if (obj.getAttribute("chk") != null && obj.getAttribute("chk") != "") {
			types = obj.type;
			names = obj.name;
			values = AF_util.getValue(obj);
			chkString = obj.getAttribute("chk");
			AF_vars.names = names;
			if (AF_vars.passFields != "") {
				if (passFields.indexOf("," + names + ",") == -1) check = true;
				else check = false;
				if (!check) alert(names);
			}
			if (check) {
				tmp1 = obj.getAttribute("exec");
				if (tmp1 != null) {
					try {
						var execStr = AF_util.getEval(tmp1);
						eval(execStr);
						values = AF_util.getValue(obj);
					} catch (e) {
						alert(
							"[AF_check 경고] - exec 구문 에러\n\n\n원본 : " +
							tmp1 +
							"\n\n변환 : " +
							execStr
						);
						return false;
					}
				}
				tmp1 = obj.getAttribute("if");
				if (tmp1 != null) {
					try {
						var ifStr = AF_util.getEval(tmp1);
						if (eval(ifStr)) {
							chkString = "필수," + chkString;
							ifmode = "Y";
						} else ifmode = "N";
					} catch (e) {
						alert(
							"[AF_check 경고] - if 구문 에러\n\n\n원본 : " +
							tmp1 +
							"\n\n변환 : " +
							ifStr
						);
						return false;
					}
				}
				if (obj.getAttribute("case") != null) {
					try {
						tmp3 = obj.getAttribute("case");
						if (tmp3.match(/!=/gi) && !tmp3.match(/==/gi)) {
							tmpArr = tmp3.split("!=");
							if (AF_util.getValue(tmpArr[0]) != tmpArr[1] + "")
								chkString = "필수," + chkString;
							else if (AF_util.getValue(obj) != "") {
								chkString = "필수," + chkString;
								focusElements = tmpArr[0];
								isContinue = false;
								chk2++;
							}
						} else if (tmp3.match(/^.+==.+=.+$/gi) && !tmp3.match(/!=/gi)) {
							tmpArr = tmp3.split("==");
							var tmpArr2 = tmpArr[1].split("=");
							if (
								eval("AF_util.getObject(tmpArr[0])." + tmpArr2[0]) ==
								eval(tmpArr2[1])
							)
								chkString = "필수," + chkString;
							else if (AF_util.getValue(obj) != "") {
								chkString = "필수," + chkString;
								focusElements = tmpArr[0];
								isContinue = false;
								chk2++;
							}
						} else if (tmp3.match(/^.+==.+!=.+$/gi)) {
							tmpArr = tmp3.split("==");
							var tmpArr2 = tmpArr[1].split("!=");
							if (
								eval("AF_util.getObject(tmpArr[0])." + tmpArr2[0]) !=
								eval(tmpArr2[1])
							)
								chkString = "필수," + chkString;
							else if (AF_util.getValue(obj) != "") {
								chkString = "필수," + chkString;
								focusElements = tmpArr[0];
								isContinue = false;
								chk2++;
							}
						} else if (tmp3.match(/=/gi)) {
							tmpArr = tmp3.split("=");
							if (AF_util.getValue(tmpArr[0]) == tmpArr[1])
								chkString = "필수," + chkString;
							else if (AF_util.getValue(obj) != "") {
								chkString = "필수," + chkString;
								focusElements = tmpArr[0];
								isContinue = false;
								chk2++;
							}
						}
					} catch (e) {
						alert(e + tmpArr[0] + " 없음");
						isContinue = false;
						chk2++;
					}
				}
				tmp1 = obj.getAttribute("func");
				if (
					tmp1 != null &&
					tmp1 != "" &&
					(AF_srch_key("필수") || !AF_util.isEmpty(values))
				) {
					try {
						chk1++;
						var funcStr = AF_util.getEval(tmp1);
						if (eval(funcStr)) chk2++;
						else isContinue = false;
					} catch (e) {
						alert(
							"[AF_check 경고] - func 구문 에러\n\n\n원본 : " +
							tmp1 +
							"\n\n변환 : " +
							funcStr
						);
						return false;
					}
				}
				AF_set_chkArr(chkString);
				if (isContinue && AF_srch_key("")) {
					if (types == "text" || types == "textarea" || types == "file") {
						chk1++;
						if (values != "" && AF_util.removeBlank(values) == "")
							isContinue = false;
						else chk2++;
					}
				}
				if (isContinue && (AF_srch_key("필수") || AF_srch_key("required"))) {
					chk1++;
					if (
						types == "text" ||
						types == "textarea" ||
						types == "hidden" ||
						types == "password" ||
						types == "file" ||
						types == "tel" ||
						types == "email" ||
						types == "number"
					) {
						if (!AF_util.isEmpty(values)) chk2++;
						else isContinue = false;
					} else if (types == "radio" || types == "checkbox") {
						if (frm.elements[names].length > 0) {
							for (var j = 0; j < frm.elements[names].length; j++) {
								if (frm.elements[names][j].checked == true) {
									chk2++;
									break;
								}
							}
						} else {
							if (frm.elements[names].checked == true) chk2++;
						}
					} else if (types == "select-one") {
						if (obj.selectedIndex > 0) chk2++;
						else isContinue = false;
					}
				}
				if (
					isContinue &&
					(AF_srch_key("정규") || AF_srch_key("regexp")) &&
					values != ""
				) {
					chk1++;
					if (
						types == "text" ||
						types == "textarea" ||
						types == "hidden" ||
						types == "password" ||
						types == "file" ||
						types == "number"
					) {
						if (obj.getAttribute("regexp") != null) {
							try {
								tmp1 = eval(obj.getAttribute("regexp"));
							} catch (e) {
								alert(
									"[AF_check 경고]\n\n정규식이 잘못되었습니다\n\n* NAME : " +
									names +
									"\n* TYPE : " +
									types +
									"\n\n정규식 : " +
									obj.getAttribute("regexp") +
									"\n\n→ /정규식/gi"
								);
								return false;
							}
							if (values.match(tmp1)) chk2++;
							else isContinue = false;
						}
					}
				}
				if (isContinue && AF_srch_key("숫자")) {
					if (
						types == "text" ||
						types == "textarea" ||
						types == "hidden" ||
						types == "password" ||
						types == "tel" ||
						types == "email" ||
						types == "number"
					) {
						chk1++;
						if (AF_util.isNum(values)) chk2++;
						else isContinue = false;
					}
				}
				if (isContinue && AF_srch_key("영어|영문|알파벳")) {
					chk1++;
					if (
						types == "text" ||
						types == "textarea" ||
						types == "hidden" ||
						types == "password"
					) {
						if (AF_util.isEng(values)) chk2++;
						else isContinue = false;
					}
				}
				if (isContinue && AF_srch_key("공백|띄어쓰기")) {
					chk1++;
					if (
						types == "text" ||
						types == "textarea" ||
						types == "hidden" ||
						types == "password" ||
						types == "tel" ||
						types == "email"
					) {
						if (!AF_util.haveBlank(values)) chk2++;
						else isContinue = false;
					}
				}
				if (isContinue && AF_srch_key("[0-9]자이상") && values != "") {
					chk1++;
					tmp1 = "";
					tmp2 = parseInt(AF_util.removeHan(AF_vars.key));
					if (AF_vars.key.match(/한글/g)) {
						tmp1 = "han";
					}
					if (
						types == "text" ||
						types == "textarea" ||
						types == "hidden" ||
						types == "password" ||
						types == "tel" ||
						types == "email" ||
						types == "number"
					) {
						if (AF_util.getCharLen(values, tmp1) >= tmp2) chk2++;
						else isContinue = false;
					}
				}
				if (
					isContinue &&
					(AF_srch_key("[0-9]자이하") || AF_srch_key("[0-9]less")) &&
					values != ""
				) {
					chk1++;
					tmp1 = "";
					tmp2 = parseInt(AF_util.removeHan(AF_vars.key));
					if (AF_vars.key.match(/한글/g)) {
						tmp1 = "han";
					}
					if (
						types == "text" ||
						types == "textarea" ||
						types == "hidden" ||
						types == "password" ||
						types == "tel" ||
						types == "email" ||
						types == "number"
					) {
						if (AF_util.getCharLen(values, tmp1) <= tmp2) chk2++;
						else isContinue = false;
					}
				}
				if (isContinue && AF_srch_key("[0-9]자입력") && values != "") {
					chk1++;
					tmp1 = "";
					tmp2 = parseInt(AF_util.removeHan(AF_vars.key));
					if (AF_vars.key.match(/한글/g)) {
						tmp1 = "han";
					}
					if (
						types == "text" ||
						types == "textarea" ||
						types == "hidden" ||
						types == "password" ||
						types == "tel" ||
						types == "email" ||
						types == "number"
					) {
						if (AF_util.getCharLen(values, tmp1) == tmp2) chk2++;
						else isContinue = false;
					}
				}
				if (ifmode == "Y") {
					tmp1 = obj.getAttribute("iftrue");
					if (tmp1 != null) {
						try {
							var execStr = AF_util.getEval(tmp1);
							eval(execStr);
						} catch (e) {
							alert(
								"[AF_check 경고] - iftrue 구문 에러\n\n\n원본 : " +
								tmp1 +
								"\n\n변환 : " +
								execStr
							);
							return false;
						}
					}
				} else if (ifmode == "N") {
					tmp1 = obj.getAttribute("iffalse");
					if (tmp1 != null) {
						try {
							var execStr = AF_util.getEval(tmp1);
							eval(execStr);
						} catch (e) {
							alert(
								"[AF_check 경고] - iffalse 구문 에러\n\n\n원본 : " +
								tmp1 +
								"\n\n변환 : " +
								execStr
							);
							return false;
						}
					}
				}
				if (chk1 != chk2) {
					if (AF_vars.errMsg == "" || AF_vars.isAllChk) {
						AF_vars.errMsg = AF_util.msg.replace(/XX/gi, AF_vars.key);
						AF_vars.errMsg = AF_vars.errMsg.replace(/\\n/gi, "\n");
					}
					if (/`.+?`/.test(AF_vars.errMsg) && typeof spCH == "function") {
						tmp1 = spCH(
							AF_vars.errMsg.match(/`.+?`/)[0].replace(/`/g, ""),
							"를",
							"을"
						);
						if (
							types == "text" ||
							types == "textarea" ||
							types == "hidden" ||
							types == "password" ||
							types == "tel" ||
							types == "email"
						)
							tmp1 += AF_vars.ment1;
						else if (
							types == "radio" ||
							types == "checkbox" ||
							types == "select-one" ||
							types == "file"
						)
							tmp1 += AF_vars.ment2;
						AF_vars.errMsg = AF_vars.errMsg.replace(/`.+?`/g, tmp1);
					}
					if (typeof AF_vars.errMsgCustomFunc == "function")
						AF_vars.errMsgCustomFunc(AF_vars.errMsg, obj);
					//   else swal("", AF_vars.errMsg, "warning");
					else alert(AF_vars.errMsg);
					// else modalControl(AF_vars.errMsg, '', 'warning');
					if (AF_vars.isAutoFocus) {
						try {
							if (focusElements == "") obj.focus();
							else frm.elements[focusElements].focus();
						} catch (e) {}
					}
					isOk = "N";
					if (AF_vars.isAllChk) {
						isContinue = true;
						chk1 = 0;
						chk2 = 0;
					} else break;
				}
			}
		}
	}
	if (isOk == "Y") return true;
	else if (isOk == "N") return false;
}

function AF(frm, isAllChk) {
	return AF_check(frm, isAllChk);
}

function AFR(frm, isAllChk) {
	var ret = AF_check(frm, isAllChk);
	if (ret) AF_removeEmptyField(frm);
	return ret;
}

function AF_removeEmptyField(frm) {
	AF_util.init(frm);
	for (var i = 0; i < frm.length; i++) {
		if (frm.elements[i].name != "") {
			if (AF_util.getValue(frm.elements[i]) == "")
				frm.elements[i].removeAttribute("name");
		}
	}
}