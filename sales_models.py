import uuid
import datetime
from uuid import uuid4
from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.contrib.auth.models import AbstractUser
from django.core.signals import request_finished
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib import admin
from django.db import models
from django.utils.translation import ugettext as _
from django.core.validators import ValidationError

from .base_models import TimeStampModel,BaseMetaDetail,BaseContactDetail
from corporate import models as c_models

"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.conf import settings
from knox.models import AuthToken
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        AuthToken.objects.create(user=instance)
"""        
        
class Store(BaseMetaDetail, BaseContactDetail, TimeStampModel):
    """
    Store Model.
    """
    
    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name = _("Stores")
        verbose_name_plural = _("Stores")
        
        
class WareHouse(BaseMetaDetail, BaseContactDetail, TimeStampModel):
    
    def __str__(self):
        return self.name
    
    
    class Meta:
        verbose_name = _("WAREHOUSES")
        verbose_name_plural = _("WAREHOUSES")
        
        
class WareHouseManager(TimeStampModel):
    """
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ware_house_manager')
    warehouse = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.warehouse


class StoreManager(TimeStampModel):
    """
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='store_manager', primary_key=True)
    store = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.store
    
    
class StoreEmployee(TimeStampModel):
    """
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='store_employee')
    name = models.CharField(max_length=100, blank=True, null=True)
    store = models.CharField(max_length=100, blank=True, null=True)
    number = models.CharField(max_length=12, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    photo = models.ImageField(upload_to="store/employees/", null=True, blank=True)
    date_of_join = models.DateField(null=True, blank=True)
    
    
class StoreEmployeeSale(TimeStampModel):
    """
    """
    employee = models.ForeignKey(StoreEmployee, on_delete=models.CASCADE, related_name='store_empployee_sales')
    sold_qty = models.PositiveIntegerField(null=True, blank=0)
    sold_amount = models.DecimalField(null=True, blank=0, max_digits=10, decimal_places=2)

    def __str__(self):
        return self.id
        
        
class WSTransferProduct(TimeStampModel):
    """
    """
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    product = models.ForeignKey(c_models.Product, on_delete=models.CASCADE)
    trans_quantity = models.PositiveIntegerField(null=True, blank=True)
    transfer_origin = models.CharField(max_length=150, null=True, blank=True)
    status = models.CharField(max_length=150, null=True, blank=True, default='AT WAREHOUSE')
    at_warehouse = models.BooleanField(default=True)
    at_store = models.BooleanField(default=False)
    
    def __str__(self):
        return '{}==>{}'.format(str(self.store), str(self.product))


class WSTransaction(TimeStampModel):
    """
    """
    store =  models.ForeignKey(Store, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_products = models.PositiveIntegerField()
    transfer_origin = models.CharField(max_length=150, null=True, blank=True)
    
    def __str__(self):
        return '{}==>{}'.format(str(self.store), str(self.quntity))
    

class StoreProduct(TimeStampModel):
    """
    """
    
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    product = models.ForeignKey(c_models.Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    is_recieved = models.BooleanField(default=False)    
    
    def __str__(self):
        return '{}==>{}'.format(str(self.store), str(self.product))


class PosProduct(TimeStampModel):
    """
    """
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    product = models.ForeignKey(c_models.Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    av_quantity = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return '{}==>{}'.format(str(self.store), str(self.product))
    

class Cart(TimeStampModel):
    customer = models.ForeignKey(c_models.Customer, on_delete=models.CASCADE)
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    gst = models.DecimalField(max_digits=10, decimal_places=2)
    quatity = models.PositiveIntegerField()
    total_paid = models.DecimalField(max_digits=10, decimal_places=2)
    total_change = models.DecimalField(max_digits=10, decimal_places=2)
    total_due = models.DecimalField(max_digits=10, decimal_places=2)
    total_bill = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, null=True, blank=True)
    cash_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    card_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    points_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    voucher_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gift_card_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    credit_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sold_by = models.CharField(max_length=100,null=True, blank=True)
    bill_by = models.CharField(max_length=100,null=True, blank=True)
    
    
    
    def __str__(self):
        return self.id


class CartItem(TimeStampModel):
    
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(c_models.Product, on_delete=models.CASCADE)
    customer = models.ForeignKey(c_models.Customer, on_delete=models.CASCADE)
    sold_by =  models.CharField(max_length=100,null=True, blank=True)
    bill_by =  models.CharField(max_length=100,null=True, blank=True)
    gst = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gst_percentage = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    sold_price = models.DecimalField(max_digits=10, decimal_places=2)    
    sold_date = models.DateField(_(u"sold Date"), auto_now_add=True, blank=True)
    payment_type = models.CharField(max_length=100, null=True, blank=True)
    sold_time = models.TimeField(_(u"soldTime"), auto_now_add=True, blank=True)
    store = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return self.id
        

def invoice_number_creator():
    inv = SaleInvoice.objects.all().count()
    invoice_order = "KL-KTM-SR-"
    number = 10000001
    if inv >0:
        i = SaleInvoice.objects.order_by('-pk')[0]
        last_invoice = i.invoice_number
        print("old")
        print(last_invoice)        
        new_one = last_invoice +1
        print(new_one)
        return new_one
    return number
            
            
class SaleInvoice(TimeStampModel):
    invoice_number = models.PositiveIntegerField(null=True, blank=True)    
    customer = models.ForeignKey(c_models.Customer, on_delete=models.CASCADE)
    subtotal_amount = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_items = models.PositiveIntegerField(null=True, blank=True)    
    total_bill = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    avg_mrp = models.DecimalField(max_digits=10, decimal_places=2,blank=True, null=True)
    payment_type = models.CharField(max_length=20, null=True, blank=True)
    cash_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    card_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    points_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    voucher_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    gift_card_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    credit_note = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    store = models.CharField(max_length=100, null=True, blank=True)
    sold_by =  models.CharField(max_length=100,null=True, blank=True)
    bill_by =  models.CharField(max_length=100,null=True, blank=True)
    bill_date = models.DateField(auto_now=True)
    bill_time = models.TimeField(auto_now=True)
    
    def __str__(self):
        return self.id
    
    def save(self, *args, **kwargs):
        i = SaleInvoice.objects.latest('invoice_number')
        print()
        self.invoice_number = invoice_number_creator()
        super(SaleInvoice, self).save(*args, **kwargs)

        
class SaleInvoiceItem(TimeStampModel):
    sale_invoice = models.ForeignKey(SaleInvoice, on_delete=models.CASCADE)
    item = models.ForeignKey(c_models.Product, on_delete=models.CASCADE)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sold_price = models.DecimalField(max_digits=10, decimal_places=2)
    store = models.CharField(max_length=100, null=True, blank=True)
    sold_by =  models.CharField(max_length=100,null=True, blank=True)
    bill_by =  models.CharField(max_length=100,null=True, blank=True)
    bill_date = models.DateField(auto_now=True)
    bill_time = models.TimeField(auto_now=True)
    
    def __str__(self):
        return self.id
        

def create_credit_number():
    cns = CreditNote.objects.all().count()
    number = 1000001
    if cns >0:
        i = CreditNote.objects.order_by('-pk')[0]
        new_inv = int(i.credit_number)+1
        return new_inv
    return number
    
    
class CreditNote(TimeStampModel):
    """
    """
    customer = models.CharField(max_length=15, null=True, blank=True)
    credit_number = models.CharField(max_length=15, null=True, blank=True)
    credit_amount = models.PositiveIntegerField()
    available_amount = models.PositiveIntegerField(null=True, blank=True)
    created_store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='credit_items')
    credit_date = models.DateField(auto_now=True)
    credit_made = models.ForeignKey(StoreEmployee, on_delete=models.CASCADE, related_name='credit_items')
    credit_invoice = models.ForeignKey(SaleInvoice, on_delete=models.CASCADE, related_name='credit_items')
    reason = models.CharField(max_length=150, null=True, blank=True)
    valid_from = models.DateField(auto_now=True)
    valid_to = models.DateField(null=True, blank=True)
    status = models.BooleanField(default=False)
    issue = models.CharField(max_length=150, null=True, blank=True)
    
            
    def save(self, *args, **kwargs):
        self.credit_number = create_credit_number()
        super(CreditNote, self).save(*args, **kwargs)


class CreditRedeem(TimeStampModel):
    """
    """
    customer = models.CharField(max_length=15, null=True, blank=True)
    redeem_invoice = models.ForeignKey(SaleInvoice, on_delete=models.CASCADE, related_name='credit_redeem', null=True, blank=True)
    credit_note = models.ForeignKey(CreditNote, on_delete=models.CASCADE, related_name='credit_redeem')
    redeem_store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='credit_redeem')
    redeem_amount = models.PositiveIntegerField()
    redeem_by = models.ForeignKey(StoreEmployee, on_delete=models.CASCADE, related_name='credit_redeem')
    redeem_date = models.DateField(auto_now=True)
    redeem_time = models.TimeField(auto_now=True)
    
    def __str__(self):
        return self.id

    
class HoldItem(TimeStampModel):
    product = models.ForeignKey(c_models.Product, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.ForeignKey(c_models.Customer, on_delete=models.CASCADE, null=True, blank=True)
    store = models.CharField(max_length=100, null=True, blank=True)
    is_retrive = models.BooleanField(default=False)
    hold_start_time = models.TimeField(auto_now=True)
    hold_end_time = models.TimeField(null=True, blank=True)
    
    def __str__(self):
        return self.id