package com.ztesoft.springboot.domain;

import java.io.Serializable;

@SuppressWarnings("serial")
public class SysMenu implements Serializable {

    private String menu_id;

    private String parent_id;

    private String menu_name;

    private String menu_level;

    private String menu_url;

    private String menu_icon;

    private String show_type;

    private String web_type;

    private String can_close;

    private String order_id;

    private String path_code;

    private String path_name;

    private String status_cd;

    private String status_date;

    private String create_date;

    private String comments;

    private String parent_name;

    private String parent_path_code;

    private String parent_path_name;

    private String sub_page_value;

    private String menu_sub_url;

    private String page_id;

    private boolean isParent;

    private String is_favor;

    private String is_child_privilege;//门户子账号菜单权限

    private String menu_view;

    public String getIs_child_privilege() {
        return is_child_privilege;
    }

    public void setIs_child_privilege(String is_child_privilege) {
        this.is_child_privilege = is_child_privilege;
    }

    public String getMenu_id() {
        return menu_id;
    }

    public void setMenu_id(String menu_id) {
        this.menu_id = menu_id;
    }

    public String getParent_id() {
        return parent_id;
    }

    public void setParent_id(String parent_id) {
        this.parent_id = parent_id;
    }

    public String getMenu_name() {
        return menu_name;
    }

    public void setMenu_name(String menu_name) {
        this.menu_name = menu_name;
    }

    public String getMenu_level() {
        return menu_level;
    }

    public void setMenu_level(String menu_level) {
        this.menu_level = menu_level;
    }

    public String getMenu_url() {
        return menu_url;
    }

    public void setMenu_url(String menu_url) {
        this.menu_url = menu_url;
    }

    public String getMenu_icon() {
        return menu_icon;
    }

    public void setMenu_icon(String menu_icon) {
        this.menu_icon = menu_icon;
    }

    public String getShow_type() {
        return show_type;
    }

    public void setShow_type(String show_type) {
        this.show_type = show_type;
    }

    public String getCan_close() {
        return can_close;
    }

    public void setCan_close(String can_close) {
        this.can_close = can_close;
    }

    public String getOrder_id() {
        return order_id;
    }

    public void setOrder_id(String order_id) {
        this.order_id = order_id;
    }

    public String getPath_code() {
        return path_code;
    }

    public void setPath_code(String path_code) {
        this.path_code = path_code;
    }

    public String getPath_name() {
        return path_name;
    }

    public void setPath_name(String path_name) {
        this.path_name = path_name;
    }

    public String getStatus_cd() {
        return status_cd;
    }

    public void setStatus_cd(String status_cd) {
        this.status_cd = status_cd;
    }

    public String getStatus_date() {
        return status_date;
    }

    public void setStatus_date(String status_date) {
        this.status_date = status_date;
    }

    public String getCreate_date() {
        return create_date;
    }

    public void setCreate_date(String create_date) {
        this.create_date = create_date;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getParent_name() {
        return parent_name;
    }

    public void setParent_name(String parent_name) {
        this.parent_name = parent_name;
    }

    public String getParent_path_code() {
        return parent_path_code;
    }

    public void setParent_path_code(String parent_path_code) {
        this.parent_path_code = parent_path_code;
    }

    public String getParent_path_name() {
        return parent_path_name;
    }

    public void setParent_path_name(String parent_path_name) {
        this.parent_path_name = parent_path_name;
    }

    public boolean getIsParent() {
        return isParent;
    }

    public void setIsParent(boolean isParent) {
        this.isParent = isParent;
    }

    public String getSub_page_value() {
        return sub_page_value;
    }

    public void setSub_page_value(String sub_page_value) {
        this.sub_page_value = sub_page_value;
    }

    public String getMenu_sub_url() {
        return menu_sub_url;
    }

    public void setMenu_sub_url(String menu_sub_url) {
        this.menu_sub_url = menu_sub_url;
    }

    public String getPage_id() {
        return page_id;
    }

    public void setPage_id(String page_id) {
        this.page_id = page_id;
    }

    public String getIs_favor() {
        return is_favor;
    }

    public void setIs_favor(String is_favor) {
        this.is_favor = is_favor;
    }

    public String getWeb_type() {
        return web_type;
    }

    public void setWeb_type(String web_type) {
        this.web_type = web_type;
    }

    public String getMenu_view() {
        return menu_view;
    }

    public void setMenu_view(String menu_view) {
        this.menu_view = menu_view;
    }

}