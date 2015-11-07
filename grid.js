//This is the sample data. 

var data = {
  "airports": [
   {
    "name": "Mayank",
    "contact" : "123456789"
   },
   {
    "name": "Niranjana",
    "contact": "987456123"
   },
   {
    "name": "Devendra Sir",
    "contact": "987454123"
   },
   {
    "name": "Oak Sir",
    "contact": "879456124"
   },
   {
    "name": "Kersi Sir",
    "contact": "123456799"
   }   
  ]
}


//Write your code below

var GridModel=Backbone.Model.extend({
});

var GridBodyView=Backbone.View.extend({
    tagName:'tr',
    template : _.template($('#gridBody').html()),
    initialize : function(){
        this.render();
    },
    render : function(){
	
		this.$el.attr('id', this.model.cid);
        this.$el.html(this.template(this.model.toJSON()));
    }
});

var GridCollection=Backbone.Collection.extend({
    model:GridModel,
	
	filterBy:function(field,fieldValue){
        var filterData=this.filter(function(item){
		
            if(item.get(field)){
					if(field=="name"){
						 return item.get(field).toLowerCase().includes(fieldValue.toLowerCase());//
					}
					else{
						  return item.get(field).toLowerCase().includes(fieldValue.toLowerCase());//
						
					}
				
			}
        });
        return new GridCollection(filterData);
    },
	
    fieldSort:function(fieldName,type){
        if(type)
            this.comparator=function(item1,item2){ 
		
                 if(item1.get(fieldName)>item2.get(fieldName))
                     return 1;
            }
        else
            this.comparator=function(item1,item2){ 
                if(item1.get(fieldName)<item2.get(fieldName))
                     return 1;
            }
    },
	
    
});



var gridView=Backbone.View.extend({
    template : _.template($('#gridHeader').html()),
    initialize : function(){
        this.render();
    },
    events:{
		'click #iata':'sortIATA',
		'click #icao':'sortICAO',
		'click #name':'sortName',
		'click #timeZoneRegionName':'sortTimeZoneRegionName',
		'click #localTime':'sortlocalTime',
		'click #city':'sortCity',
        'click #countryName':'sortCountryName',
        //'keyup #searchKey':'filterData',
        'click #searchBtn':'filterData',
		//'click td':'changeData'
    },
	render : function(){
        this.$el.html(this.template());
        //this.renderItemView();
    },
	sortIATA:function(){
        this.sortData("iata");
    },
	sortICAO:function(){
        this.sortData("icao");
    },
	sortName:function(){
        this.sortData("name");
    },
	sortlocalTime:function(){
        this.sortData("localTime");
    },
	sortTimeZoneRegionName:function(){
        this.sortData("timeZoneRegionName");
    },
    sortCity:function(){
		
        this.sortAddress("address","city");
    },
	sortCountryName:function(){
		
        this.sortAddress("address","countryName");
    },
  

    renderItemView:function(){
        var element=this.$el.find('#gridRow');
        element.empty();
        if(this.collection.size()==0){
            $('.gridTable').addClass('hide');
            alert('No such employee exist !')
        }
        else{
            $('.gridTable').removeClass('hide')
        }
		this.collection.forEach(airportModel => element.append(new GridBodyView({model:airportModel}).el))//ECMA arrow function
    },
    filterData:function(e){
        e.preventDefault();
        if(!this.myCollection)
            this.myCollection=this.collection.clone();
        var field="name";
        var fieldValue=$('#searchKey').val();

        if(fieldValue){
			if(field=="airports"){
					this.collection=this.myCollection.filterBy(field,fieldValue);
			}else{
					this.collection=this.myCollection.filterBy(field,fieldValue);
			}
        }
        else{
            this.collection.reset();
            //this.$el.find('#gridRow').append('<td colspan="2">No such employee exist</td>');
        }
        this.renderItemView();
    },
  
	sortAddress:function(field,subfield){
		 var orderBy=1;
		 if(this.lastSearchBy==subfield){
           if(this.lastSortingOrder)
                orderBy=0;
        }
		this.collection.addressSort(field,subfield,orderBy);
		this.collection.sort();
        this.lastSearchBy=subfield;
        this.lastSortingOrder=orderBy;
        this.renderItemView();
	},
    sortData:function(field){
        var orderBy=1;
        if(this.lastSearchBy==field){
           if(this.lastSortingOrder)
                orderBy=0;
        }	
		this.collection.fieldSort(field,orderBy);
        this.collection.sort();
        this.lastSearchBy=field;
        this.lastSortingOrder=orderBy;
        this.renderItemView();
    },
	changeData:function(e){
		'use strict'
		var that=this;
		var element=e.target;
		var duplicate=false;
		var thName = $(element).closest('table').find('th').eq($(element).index());
		var temp=$(e.target).text();
		$(e.target).text("");
		$('<input type="text" />').appendTo($(e.target)).val(temp).select().blur(
			function() {
				var newText = $(this).val();
				$(this).parent().text(newText).find('input:text').remove();
				var currentModelId=$(element).parent().attr("id");
				if(thName.attr("name")=="address"){
					var addressObject=that.collection.get(currentModelId).get("address")
					addressObject[thName.attr("id")]=newText;
					that.collection.get(currentModelId).set("address",addressObject);
				}else{
					if(thName.attr("name")=='iata'||thName.attr("name")=='name'){
						for(let i=0;i<that.collection.models.length;i++){                               //ECMA let keyword
							if(that.collection.models[i].cid==currentModelId)
								continue;
							if(that.collection.models[i].get(thName.attr("name")).toLowerCase()==newText.toLowerCase())
							{	
								duplicate=true;
								break;
							}
						
						}
						if(duplicate){
							alert("Already Exists.");
						
						}else{
							that.collection.get(currentModelId).set(thName.attr("name"),newText);
						}
					}else{
						that.collection.get(currentModelId).set(thName.attr("name"),newText);
					}
					
				}
				that.renderItemView();
			});
		
	}
})

var gridCollection=new GridCollection(data.airports);
new gridView({collection:gridCollection,el : '#main-region'});




