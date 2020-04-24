const db = require('../db');
const { expect } = require('chai');

describe('db', ()=> {
  let users, products;
  beforeEach(async()=> {
    const seed = await db.sync();
    users = seed.users;
    products = seed.products;
  }); 

  it('there are 3 users', ()=> {
    expect(Object.keys(users).length).to.eq(3);
  });

  it('moe is a user', ()=> {
    expect(users.moe.username).to.equal('moe');
  });

  describe('cart', ()=> {
    let moesCart;
    beforeEach(async()=> {
      moesCart = await db.getCart(users.moe.id);
    });

    it('moe can get a cart', async()=> {
      expect(moesCart).to.be.ok;
    });

    describe('adding to cart', ()=> {

      it('adding to cart adds line Item', async()=> {
        let lineItem = await db.addToCart({ userId: moesCart.userId, productId: products.foo.id });
        expect(lineItem.quantity).to.eq(1);
      });

      it('adding same item increments quantity', async()=> {
        let lineItem = await db.addToCart({ userId: moesCart.userId, productId: products.foo.id });
        lineItem = await db.addToCart({ userId: moesCart.userId, productId: products.foo.id });
        expect(lineItem.quantity).to.eq(2);
      });

      it('adding a new item adds new line item', async()=> {
        await db.addToCart({ userId: moesCart.userId, productId: products.foo.id });
        await db.addToCart({ userId: moesCart.userId, productId: products.bar.id });
        await db.addToCart({ userId: moesCart.userId, productId: products.bar.id });
        const lineItems = await db.getLineItems(moesCart.userId);
        expect(lineItems.length).to.eq(2);
        const bars = lineItems.find( li => li.productId === products.bar.id);
        const foos = lineItems.find( li => li.productId === products.foo.id);
        expect(bars.quantity).to.equal(2);
        expect(foos.quantity).to.equal(1);
      });
    });

    describe('removing from cart', ()=> {
      it('removing from cart removes line item', async()=> {
        let lineItem = await db.addToCart({ userId: moesCart.userId, productId: products.foo.id });
        lineItem = await db.addToCart({ userId: moesCart.userId, productId: products.foo.id });
        await db.removeFromCart({ lineItemId: lineItem.id, userId: moesCart.userId });
        const lineItems = await db.getLineItems(moesCart.userId);
        expect(lineItems.length).to.equal(0);
      });
    });
    describe('creating an order', ()=> {
      it('moe can generate an order', async()=> {
        expect(moesCart.status).to.equal('CART');
        const order = await db.createOrder(moesCart.userId);
        expect(order.status).to.equal('ORDER');
      });
    });
  });
});
