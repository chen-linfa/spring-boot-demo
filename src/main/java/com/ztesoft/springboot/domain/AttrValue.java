package com.ztesoft.springboot.domain;

import java.io.Serializable;

/**
 * 静态数据
 */
@SuppressWarnings("serial")
public class AttrValue implements Serializable {

    private String attr_value_id;
    private String attr_id;
    private String attr_value;
    private String attr_value_name;
    private String attr_value_desc;
    private String parent_attr_value;

    public String getAttr_value_id() {
        return attr_value_id;
    }

    public void setAttr_value_id(String attr_value_id) {
        this.attr_value_id = attr_value_id;
    }

    public String getAttr_id() {
        return attr_id;
    }

    public void setAttr_id(String attr_id) {
        this.attr_id = attr_id;
    }

    public String getAttr_value() {
        return attr_value;
    }

    public void setAttr_value(String attr_value) {
        this.attr_value = attr_value;
    }

    public String getAttr_value_name() {
        return attr_value_name;
    }

    public void setAttr_value_name(String attr_value_name) {
        this.attr_value_name = attr_value_name;
    }

    public String getAttr_value_desc() {
        return attr_value_desc;
    }

    public void setAttr_value_desc(String attr_value_desc) {
        this.attr_value_desc = attr_value_desc;
    }

    public String getParent_attr_value() {
        return parent_attr_value;
    }

    public void setParent_attr_value(String parent_attr_value) {
        this.parent_attr_value = parent_attr_value;
    }
}