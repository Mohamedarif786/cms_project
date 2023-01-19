/**
 * @summary     jQuery based pagination class, for bootstap elements
 * @description CMS Pagination, for table 
 * @file        pagination.js
 * @author      Roshan Chettri
 *
 */
class Pager {

  /**
  * Constructor defination
  *  @param {divId} id to render the pagination elements to //currently only one elements supported @todo multiple
  *  @param {perPage} records per page
  *  @param {tableId} table id refferd for pagination
  *  @param {noContentMsg} content to show when no data found
  *  @param {filter} enables filter will add filter to table refers to th data attribute 
  *  @returns {pagination element}  
  *
  *  @example usage
  *    new Pager({
  *      divId 
  *      perPage 
  *      tableId 
  *      noContentMsg 
  *      filter // currently supports [data-search, data-all (assuems checkbox under same index level)] 
  *      deleteAll // call back function to manage delete all button click
  *     });
  */
  constructor(init) {

    this._id = init.divId;
    this._tableId = init.tableId;
    this._noContentMsg = init.noContentMsg;
    //limit and offset
    this._recordPerPage = init.perPage != undefined ? init.perPage : 10; //default to 5, pass to overwrite   
    this._filter = init.filter ? init.filter : false;
    this._deleteAll = init.deleteAll;
    this._totalElement = $('#' + this._tableId).find('tbody tr').length;
    this._totalElement > 0 ? this.process() : this.noContent();
  }

  /**
  * display when no content found
  */
  noContent() {
    $('#' + this._tableId).html(`<p class="text-center">${this._noContentMsg}</p>`);
  }

  /**
  * navigate to previous page
  */
  prevPage() {
    if (this.current_page > 1) {
      this.current_page--;
      this.setPage(this.current_page);
    }
  }

  /**
  * navigate to next page
  */
  nextPage() {
    if (this.current_page < this.numPages()) {
      this.current_page++;
      this.setPage(this.current_page);
    }
  }

  /**
  * returns no of pages
  */
  numPages() {
    return Math.ceil(this._totalElement / this._recordPerPage);
  }

  /**
  * reset method (usage call to refresh on update/ delete)
  */
  reset() {
    this._totalElement = $('#' + this._tableId).find('tbody tr').length;
    this.setPage(1);
  }

  /**
  * method binded if filter on , makes current page all checkbox enable at given postion 
  * note place below correct index on template 
  */
  checkAll(index, ele) {
    // pass this as constructor
    //.delete-check incase there are multiple checkbox , specify all checkbox identier
    this._all = ele;
    this._allIndex = index;
    for (var i = (this.current_page - 1) * this._recordPerPage; i < (this.current_page * this._recordPerPage); i++) {
      let _checked = $($(this._all)[0].target).is(":checked");
      let _ele = $('#' + this._tableId).find('tbody tr').eq(i).find('.delete-check');//[index];
      if ($(_ele)[0]) {
        $(_ele).prop("checked", _checked);
      }
    }
  }

  /**
  * method binded if filter on , makes current page index searchable
  * note place below correct index on template 
  */
  searchCol(index, ele) {
    try {
      this._seach = ele;
      this._searchIndex = index;
      for (var i = (this.current_page - 1) * this._recordPerPage; i < (this.current_page * this._recordPerPage); i++) {
        let _ele = $($('#' + this._tableId).find('tbody tr').eq(i).find('td')[index]).html().trim().toLowerCase();
        let _text = $($(this._seach)[0].target).val().toLowerCase();
        if (!_ele.includes(_text)) {
          $('#' + this._tableId).find('tbody tr').eq(i).hide();
        } else {
          $('#' + this._tableId).find('tbody tr').eq(i).show();
        }
      }
    } catch (error) {

    }
  }


  /**
  * method to sort
  *  
  */
  sort(dir, index, ele) {
    try {
      var $tbody = $('#' + this._tableId).find('tbody');
      $tbody.find('tr').sort(function (a, b) {
        var tda = $(a).find('td:eq(' + index + ')').text();
        var tdb = $(b).find('td:eq(' + index + ')').text();
        return dir == 'Up' ? tda < tdb ? 1 : tda > tdb ? -1 : 0 : tda < tdb ? -1 : tda > tdb ? 1 : 0
      }).appendTo($tbody);
    } catch (error) {

    }
  }

  /**
  * returns user defiled callback 
  */
  deleteAll() {
    this._deleteAll()
  }

  /**
  * adds filter rows on header based on defilation of template
  */
  addFilter() {
    let _thead = $('#' + this._tableId).find('thead');
    let _rowData = []
    $('.paginationFilterRow, paginationFilterSpan').remove()

    $(_thead).find('th').each((index, ele) => {
      let _fItem;
      if ($(ele).data('all') == true) {
        _fItem = $('<input type="checkbox"/>').click((e) => {
          this.checkAll(index, e)
        })
        _rowData.push(_fItem)
      } else if ($(ele).data('search') == true) {
        _fItem = $('<input type="text"  class="form-control"/>').keyup((e) => {
          this.searchCol(index, e)
        })
        _rowData.push(_fItem)
      }

      /* else if ($(ele).data('action') == true) {
         _fItem = $(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="feather feather-trash align-middle">
                 <polyline points="3 6 5 6 21 6"></polyline>
                 <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
             </svg></a>`).click((e) => {
           this.deleteAll()
         })
         _rowData.push(_fItem)
       }
     */
      else if ($(ele).data('sort') == true) {
        let _fItemDown = $(`<a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down align-middle me-2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg></a>`).click((e) => {
          this.sort('Down', index, e)
        })
        let _fItemUp = $(`<a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up align-middle me-2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg></a>`).click((e) => {
          this.sort('Up', index, e)
        })
        _rowData.push([_fItemUp, _fItemDown])
      }
      else {
        _fItem = $('<span class="paginationFilterSpan">');
        _rowData.push(..._fItem)
      }
    })
    let _filterRow = $('<tr class="paginationFilterRow">');
    for (const key in _rowData) {
      let _th = $('<th>');
      _th.append(_rowData[key]);
      _filterRow.append(_th)
    }
    _thead.append(_filterRow);
  }

  /**
  * clears filter states
  */
  resetFilter() {
    if (this._all != undefined) {
      $($(this._all)[0].target).prop("checked", false);
      this.checkAll(this._allIndex, this._all);
    }
    if (this._seach != undefined) {
      $($(this._seach)[0].target).val('');
      this.searchCol(this._searchIndex, this._seach);
    }
  }

  /**
  * init process setup call
  */
  process() {
    if (this._filter == true) {
      this.addFilter()
    }
    if (this._recordPerPage == 'all') {
      this._recordPerPage = this._totalElement
    }

    this.setPage(1)
  }

  /**
  * sets current page with required elements
  */
  setPage(page) {
    if (this._filter == true) {
      this.resetFilter();
    }
    this.current_page = page;
    this.render('clear');
    let _next = $(`<li class="page-item"><a class="page-link" title="Next" href="#">>></a></li>`).click(() => {
      this.nextPage()
    })
    let _prev = $(`<li class="page-item"><a class="page-link" title="Previous" href="#"><<</a></li>`).click(() => {
      this.prevPage()
    })

    if (page < 1) page = 1;
    if (page > this.numPages()) page = this.numPages();

    $('#' + this._tableId).find('tbody tr').hide();
    for (var i = (page - 1) * this._recordPerPage; i < (page * this._recordPerPage); i++) {
      $('#' + this._tableId).find('tbody tr').eq(i).show();
    }
    if (page == 1) {
      _prev = $(`<li class="page-item disabled"><a class="page-link" href="#"  title="Previous" tabindex="-1"><<</a></li>`);
    }

    if (page == this.numPages()) {
      _next = $(`<li class="page-item disabled"><a class="page-link" href="#" title="Next" tabindex="-1">>></a></li>`);
    }

    if (this.numPages() > 1) {
      this.render(_prev[0])

      let start_page = 0;
      let end_page = 0;

      if (this.numPages() > 5) {
        start_page = page < 5 ? 1 : page - 3;
        end_page = start_page + 5;

        if (end_page >= this.numPages()) {
          end_page = this.numPages() + 1;
        }

      }
      else {
        start_page = 1;
        end_page = this.numPages();
        if (end_page >= this.numPages()) {
          end_page = this.numPages() + 1;
        }
      }

      for (let index = start_page; index < end_page; index++) {
        let _ele = $(`<li class="page-item  ${index == page ? 'active' : ''}"><a class="page-link" href="#">${index}</a></li>`).click(() => {
          this.setPage(index);
        })
        this.render(_ele[0])
      }


      this.render(_next[0])
    }
    this.render('stats');
  }

  /**
  * renders pagination elements
  */
  render(html) {
    if (html == 'clear') {
      $('#' + this._id).html('');
    } else if (html == 'stats' && this._totalElement > 0) {
      $('#' + this._id + 'Stats').html(`<p>Page ${this.current_page} of ${this.numPages()}</p>`).show();
    } else {
      $('#' + this._id).append(html);
    }
  }

}