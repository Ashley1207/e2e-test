describe('test todo list', function () {
    let page;
    let todoListLength;

    before (async function () {
      page = await browser.newPage();
      await page.goto('http://127.0.0.1:7001');
    });
  
    after (async function () {
      await page.close();
    });

//添加新的代办事项
    it('should new todo correct', async function() {
      await page.click('#new-todo', {delay: 500});
      await page.type('#new-todo', 'new todo item', {delay: 50});
      await page.keyboard.press("Enter");

      let todoList = await page.waitFor('#addTodo');//获取todolist
      const expectInputContent = await page.evaluate(todoList => todoList.lastChild.querySelector('label').textContent, todoList);
      expect(expectInputContent).to.eql('new todo item');
    }) 

    })
  
    it('should complete todo correct', async function() {
      await page.click('#todo-list li:nth-last-child(1) input'); 
      await page.reload(); 
      let status = await page.$eval('#todo-list li:nth-last-child(1)', li => li.className); 
      expect(status).to.eql('completed'); // className 应变成 completed
    })

    it('should delete todo correct', async function() {
      await page.hover('#todo-list li:nth-last-child(1)'); 
      await page.click('#todo-list li:nth-last-child(1) button'); 

      await page.reload(); 
      let todoListLengthAfterDelete = await page.$eval('#todo-list', todoList => todoList.children.length); 
      expect(todoListLength - todoListLengthAfterDelete).to.eql(1); // 删除待办事项后，新的 todoList 的长度应为 删除前的 todoList 的长度 - 1

      
      await page.hover('#todo-list li:nth-last-child(1)'); 
      await page.click('#todo-list li:nth-last-child(1) button'); 
    }) 


    it('should show todo correct', async function() {
      const todoListLength = await page.evaluate(() => {
          return document.getElementsByClassName('view').length;
      });
      const doneListLength = await page.evaluate(() => {
          return document.getElementsByClassName('completed').length;
      });
      let todoCount = await page.waitFor('#todo-count');
      const count = await page.evaluate(todoCount => todoCount.querySelector('strong').textContent, todoCount)
      expect(todoListLength - doneListLength).to.eql(+count);
  })
});