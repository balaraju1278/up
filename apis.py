"""
Product related api lives here.

warehouse: 8XZ53Q8Y
username:"NUB1234

store: 
username: 101201
password:05563782


emp:101212
pwd:81337849
"""

import json
import datetime
import string
import random
from django.utils import timezone
from django.http import JsonResponse,HttpResponse
from django.views import View
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import generics
from rest_framework import viewsets, filters
from rest_framework import filters
from celery import shared_task

from django.http import HttpResponse
from django.template import Context
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage

from corporate import models
from corporate.data_models.marketing_models import Customer
from corporate import serializers

from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser,JSONParser
from knox.models import AuthToken

from escpos import *

def style_number_creator():
    sns = models.StyleNumber.objects.filter(style_number=1001).exists()
    if sns:
        sn = models.StyleNumber.objects.order_by('-pk')[0]
        news_sn = sn.style_number+1
        return news_sn
    number=1001
    return number
   

def style_code_creator(brand, cat, gen,weave, sn):
    sn = str(sn)
    style_code = brand+cat+gen+weave+sn
    return style_code
    
def password_generator(size=8, chars=string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def send_report(request):
    subject = "Sales Report"
    to = ['balaraju.mme@gmail.com']
    from_email = 'balaraju.mme@gmail.com'

    ctx = {
        'user': 'buddy',
        'purchase': 'Books'
    }

    message = get_template('daily_sales_report.html').render(Context(ctx))
    msg = EmailMessage(subject, message, to=to, from_email=from_email)
    msg.content_subtype = 'html'
    msg.send()

    return Response(status=status.HTTP_200_OK)    
    
    
def generate_bill(bill_data):
    Epson = printer.Usb(0x1c8a,0x3a25,0,0x81,0x02)
    # Print text
    print(bill_data)
    bill_data=bill_data
    Epson.text("\t\tNUBERRY\n")
    Epson.text("\n")
    Epson.text(" \t STORE: {}\n".format(bill_data['store_name']))
    Epson.text("1003 T1, BUSINESS PARK, HILITE CITY\n")
    Epson.text("KOZHIKODE -673014\n")
    Epson.text("GSTIN NO: 32AAFCN978K1ZW\n")
    Epson.text("CIN: U749432SLFDJS234\n")
    Epson.text("PH: 0495-2337400\n")
    Epson.text("PLACE OF SUPPLY:CALICUT\n")
    Epson.text("\n")
    Epson.text("CUSTOMER NAME:\t {}\n".format(bill_data['customer_name']))
    Epson.text("CUSTOMER NUMBER: \t {}\n".format(bill_data['customer_number']))
    Epson.text("INVOICE NO: \t {}\n".format(bill_data['invoice_number']))
    Epson.text("DATE: \t {}\n".format(bill_data['bill_date']))
    Epson.text("TIME: \t {}\n".format(bill_data['bill_time']))
    Epson.text("PH: 0495-2337400\n")
    Epson.text("\n")        
    Epson.text("BARCODE\tDESC\tQTY\DISCOUNT\tVALUE\n")
    for i in range(len(bill_data['items'])):
        Epson.text("{}\t{}\t{}\0\t{}\n".format(bill_data['items'][i].barcode,bill_data['items'][i].description, 1, 0, bill_data['items'][i].mrp_cost))
    Epson.text("SUB TOTAL:\t {}\n".format(bill_data['sub_total']))
    Epson.text("\n")
    Epson.text("TAX:\t {}\n".format(bill_data['tax_amount']))
    Epson.text("TOTAL BILL :\t {}\n".format(bill_data['total_bill']))
    Epson.text("TOTAL ITEMS: \t{}\n".format(bill_data['total_items']))
    Epson.text("\n")
    Epson.text("STAFF ID: \t {}\n".format(bill_data['bill_by']))
    Epson.qr("\t\t8978805195")
    Epson.text("\t*** THANK YOU VISIT AGAIN***\n")
    Epson.text("*** EXCHANGE WITHIN 7 DAYS WITH BILL***\n")
    # Cut paper
    Epson.cut()



        
@api_view(['GET', 'POST'])
def ware_house_create(request):
    if request.method == 'POST':
        serializer = serializers.WareHouseSerializer(data=request.data)
        print("s", serializer)
        if serializer.is_valid():
            username = request.data.get('emp_id')
            password = password_generator()
            print(password)
            user = User.objects.create(username=username, email=request.data.get('contact_email'))
            user.set_password(password)
            user.save()
            wh_manager = models.WareHouseManager.objects.create(user=user, warehouse=request.data.get('name'))
            wh_manager.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST'])
def store_create(request):
    if request.method == 'POST':
        serializer = serializers.StoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            username = request.data.get('emp_id')
            password = password_generator()
            print("passord", password)
            user = User.objects.create(username=username, email=request.data.get('contact_email'))
            user.set_password(password)
            user.save()
            store_manager = models.StoreManager.objects.create(user=user, store=request.data.get('name'))
            store_manager.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def create_store_employee(request):
    if request.method == 'POST':
        print("requs")
        print(request.data)
        username = request.data.get('number')
        password  = password_generator()
        print("password", password)
        user=User.objects.create(username=username)
        user.set_password(password)
        user.save()
        store_employee = models.StoreEmployee.objects.create(user=user, name=request.data.get('name'), store=request.data.get('store'), number=request.data.get('number'), email=request.data.get('email'), date_of_join=request.data.get('date_of_join'))
        store_employee.save()
    return Response(status=status.HTTP_201_CREATED)
            
            
@api_view(['GET', 'POST'])
def create_customer(request):
    print("fom a")
    if request.method == 'POST':
        print(request.data)
        serializer = serializers.CustomerCreateSerializer(data=request.data)
        print("before")
        if serializer.is_valid():
            print("inside")
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET', 'POST'])
def edit_customer_details(request):
    if request.method == 'POST':
        customer = request.data
        print(customer)
        number = request.data.get('mobile_number')
        name = request.data.get('name')
        dob = request.data.get('date_of_birth')
        gender = request.data.get('gender')
        customer_instance = models.Customer.objects.get(mobile_number=number)
        customer_instance.name = name
        customer_instance.date_of_birth = dob
        customer_instance.gender = gender
        customer.save()
        return Response(status=status.HTTP_200_OK) 
        
        
@api_view(['GET', 'POST'])
def get_employe_list(request):
    if request.method == 'GET':
        print("")
        emps = models.StoreEmployee.objects.all()
        serializer = serializers.StoreEmployeeSerializer(emps, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

@api_view(['GET', 'POST'])
def get_store_invoice_list(request):
    if request.method == 'GET':
        print(request.META.get('HTTP_AUTHORIZATION', " "))
        t = request.META.get('HTTP_AUTHORIZATION', " ")
        print(request.user)
        token = Token.objects.get(key=t)
        user = User.objects.get(id=token.user_id)
        store=user.store_employee.store        
        today_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
        today_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)
        invoices = models.SaleInvoice.objects.filter(store=store, bill_date__range=(today_min, today_max))
        serializer = serializers.SalesInvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def get_all_invoice_list(request):
    if request.method == 'GET':
        invoices = models.SaleInvoice.objects.all()
        serializer = serializers.SalesInvoiceSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
@api_view(['GET', 'POST'])
def get_last_invoice(request):
    if request.method == 'GET':
        invoice = models.SaleInvoice.objects.order_by('-pk')[0]
        serializer = serializers.SalesInvoiceSerializer(invoice)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def get_last_credit_number(request):
    if request.method == 'GET':
        cn = models.CreditNote.objects.order_by('-pk')[0]
        serializer = serializers.CreditNoteSerializer(cn)
        return Response(serializer.data, status=status.HTTP_200_OK)        
        

@api_view(['GET', 'POST'])
def get_store_invoice_item_list(request):
    if request.method == 'GET':
        today_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
        today_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)
        invoices = models.SaleInvoiceItem.objects.filter(store=request.user.store_manager.store, bill_date__range=(today_min, today_max))
        serializer = serializers.SaleInvoiceItemSerializer(invoices, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
@api_view(['GET', 'POST'])
def get_store_credit_notes_list(request):
    if request.method == 'GET':
        print(request.META.get('HTTP_AUTHORIZATION', " "))
        t = request.META.get('HTTP_AUTHORIZATION', " ")
        print(request.user)
        token = Token.objects.get(key=t)
        user = User.objects.get(id=token.user_id)
        store=user.store_employee.store        
        today_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
        today_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)
        store_inst = models.Store.objects.get(name=store)
        credit_notes = models.CreditNote.objects.filter(created_store=store_inst, credit_date__range=(today_min, today_max))
        serializer = serializers.CreditNoteSerializer(credit_notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

@api_view(['GET', 'POST'])
def get_store_credit_redeem_list(request):
    print("from reddms")
    if request.method == 'GET':
        print(request.META.get('HTTP_AUTHORIZATION', " "))
        t = request.META.get('HTTP_AUTHORIZATION', " ")
        print(request.user)
        token = Token.objects.get(key=t)
        user = User.objects.get(id=token.user_id)
        store=user.store_employee.store        
        today_min = datetime.datetime.combine(datetime.date.today(), datetime.time.min)
        today_max = datetime.datetime.combine(datetime.date.today(), datetime.time.max)
        store_inst = models.Store.objects.get(name=store)
        credit_redeems = models.CreditRedeem.objects.filter(redeem_store=store_inst, redeem_date__range=(today_min, today_max))
        serializer = serializers.CreditRedeemSerializer(credit_redeems, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['GET'])
def get_all_store_emps(request):
    print(request.META.get('HTTP_AUTHORIZATION', " "))
    t = request.META.get('HTTP_AUTHORIZATION', " ")
    print(request.user)
    token = Token.objects.get(key=t)
    user = User.objects.get(id=token.user_id)
    store=user.store_employee.store
    emps = models.StoreEmployee.objects.filter(store=store)
    serializer = serializers.StoreEmployeeSerializer(emps, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

    
@api_view(['GET', 'PUT', 'DELETE'])
def get_credit_Item_detail(request, credit_number):
    try:
        credit_number=models.CreditNote.objects.get(credit_number=credit_number)
    except models.CreditNote.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = serializers.CreditNoteSerializer(credit_number)
        return Response(serializer.data)
            
      
@api_view(['GET', 'POST'])
def get_store_details(request):
    if request.method == 'GET':
        store_inst = request.user.store_manager.store
        store = models.Store.objects.get(name=store_inst)
        serializer =  serializers.StoreSerializer(store)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def style_number_create(request):
    print("calling")
    if request.method == 'POST':
        print("after")
        serializer = serializers.StyleNumberSerializer(data=request.data)
        if serializer.is_valid():
            print(request.data)
            style_num = style_number_creator()
            sn = style_num
            b = request.data.get('brand')
            c=request.data.get('category')
            g=request.data.get('gender')
            w=request.data.get('weave')       
            print(b[:1])
            print(c[:1])
            print(g)
            print(w[:1])
            style_code = style_code_creator(b[:1], c[:1],g[:1],w[:1],style_num)
            models.StyleNumber.objects.create(brand=b, weave=w, category=c, gender=g, style_number=sn, style_code=style_code)        
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def hold_item(request):
    if request.method == 'POST':
        """
        token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
        print(request.META.get('HTTP_AUTHORIZATION', " "))
        data= {'token': token}
        from rest_framework.exceptions import ValidationError
        try:
            from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
            valid_data = VerifyJSONWebTokenSerializer().validate(data)
            user = valid_data['user']
            request.user  =user
        except ValidationError as v:
            print("validation Error", v)
        """
        cus = request.data.get('customer')
        customer_inst = models.Customer.objects.get(mobile_number=cus)
        emp_inst = request.data.get('emp')
        user = User.objects.get(id=emp_inst)
        store_inst = user.store_employee.store
        items = request.data.get('hold_items')
        for i in range(len(items)):
            product_inst = models.Product.objects.get(barcode=items[i]['product']['barcode'])
            hold_item = models.HoldItem.objects.create(product=product_inst,
                                                       customer=customer_inst,
                                                       store=store_inst,
                                                       hold_start_time = datetime.datetime.now(),                                                                                                               
                                                       )
            hold_item.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'POST'])
def get_store_hold_items(request):
    if request.method == 'GET':
        #store = request.user.store_employee.store
        hold_items = models.HoldItem.objects.filter(is_retrive=False)
        serializer = serializers.HoldItemSerializer(hold_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)
        

        
@api_view(['GET', 'POST'])
def retrive_hold_item(request):
    if request.method == 'POST':
        cus = request.data.get('customer')
        customer_inst = models.Customer.objects.get(mobile_number=cus)
        emp_inst = request.data.get('emp')
        user = User.objects.get(id=emp_inst)
        store_inst = user.store_employee.store
        #store_inst = request.user.store_employee.store
        items = request.data.get('retrive_items')
        for i in range(len(items)):
            product_inst = models.Product.objects.get(barcode=items[i]['product']['barcode'])
            try:
                hold_item = models.HoldItem.objects.get(customer=customer_inst, store=store_inst, is_retrive=False)
                hold_item.is_retrive = True
                hold_item.save()
            except:
                pass
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)
    

def get_invoice_number():
    inv = models.SaleInvoice.objects.all().count()
    number = 10000001
    if inv >0:
        i = models.SaleInvoice.objects.order_by('-pk')[0]
        last_invoice = i.invoice_number        
        new_one = last_invoice +1
        return new_one
    return number
    
@api_view(['GET', 'POST'])
def customer_check_out(request):
    if request.method == 'POST':
        #print(request.data)
        cus = request.data.get('customer')
        user = request.data.get('emp')
        bill_user = User.objects.get(id=user)
        customer_inst = Customer.objects.get(mobile_number=cus)
        print(customer_inst)
        employee_inst = models.StoreEmployee.objects.get(number=request.data.get('sold_by'))
        subtotal_amount = request.data.get('subTotal')
        discount = request.data.get('discount')
        gst = request.data.get('gst')
        quatity = request.data.get('quantity')
        total_paid = request.data.get('totalPaid')
        total_change = request.data.get('totalChange')
        total_due = request.data.get('totalDue')
        total_bill = request.data.get('totalBill')
        payment_data = request.data.get('payment')
        redeem_amount = payment_data['credit_amount']
        print(redeem_amount)
        credit_number = request.data.get('credit_number')
        print(credit_number)
        if len(credit_number) >= 7:
            try:
                credit_note_inst = models.CreditNote.objects.get(credit_number=credit_number, customer=cus)
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
                
            if credit_note_inst and credit_note_inst.status == True:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            else:            
                credit_number = models.CreditNote.objects.get(credit_number=request.data.get('credit_number'))
                credit_number.status = True
                credit_number.save()            
                cart = models.Cart.objects.create(customer=customer_inst,
                                                  sold_by=employee_inst.name,
                                                  subtotal_amount=subtotal_amount, 
                                                  discount=discount, 
                                                  gst=gst, 
                                                  quatity=quatity, 
                                                  total_paid=total_paid, 
                                                  total_change=total_change, 
                                                  total_due=total_due, 
                                                  total_bill=total_bill
                                                  )
                cart.save()
                
                #loyalty points calculations
                purchase_amount = int(request.data.get('totalBill'))
                new_points = purchase_amount/100
                print(new_points)
            
                from decimal import Decimal
                customer_inst.total_points = customer_inst.total_points+Decimal(new_points)
                customer_inst.total_amount_purchase = customer_inst.total_amount_purchase+purchase_amount        
                customer_inst.save()
                # invoice
                avg_mrp_price = int(total_bill)/int(quatity)
                inv = get_invoice_number
                invoice = models.SaleInvoice.objects.create(
                    invoice_number = inv,
                    customer=customer_inst,
                    subtotal_amount = subtotal_amount,
                    discount=discount,
                    tax_amount=gst,
                    total_items=quatity,
                    total_bill=total_bill,
                    avg_mrp=avg_mrp_price,
                    cash_amount=payment_data['cash'],
                    card_amount=payment_data['card'],
                    points_amount=payment_data['points'],
                    voucher_amount=payment_data['voucher'],
                    gift_card_amount=payment_data['gift_card'],
                    credit_note = redeem_amount,
                    store=bill_user.store_employee.store,
                    sold_by=employee_inst.name,
                    bill_by=bill_user.store_employee.name    
                )
                invoice.save()
                # items saving
                items = request.data.get('items')
                
                bill_items = []
                for i in range(len(items)):
                    product_inst = models.Product.objects.get(barcode=items[i]['product']['barcode'])
                    bill_items.append(product_inst)
                    store_inst = employee_inst.store
                    d=datetime.datetime.now()
                    cart_item = models.CartItem.objects.create(product=product_inst, 
                                                               customer=customer_inst, 
                                                               sold_by=employee_inst.name,
                                                               unit_price=items[i]['product']['mrp_cost'],
                                                                sold_price=items[i]['product']['mrp_cost'],
                                                                sold_date=datetime.date.today(),
                                                                sold_time=d.strftime("%X"),
                                                                store=store_inst 
                                                                )
                    cart_item.save()
                    sale_invoice_item = models.SaleInvoiceItem.objects.create(
                                    sale_invoice = invoice,
                                    item = product_inst,
                                    unit_price=items[i]['product']['mrp_cost'],
                                    sold_price=items[i]['product']['mrp_cost'],
                                    store=store_inst,
                                    sold_by=employee_inst.name,
                                    bill_by=bill_user.store_employee.name,
                                    bill_date=datetime.date.today(),
                                    bill_time=d.strftime("%X")
                    )
                    #sp = models.PosProduct.objects.get(product=product_inst)
                    #sp.av_quantity = sp.av_quantity-1
                    #sp.save()
                    #product_inst.av_quantity = product_inst.av_quantity-1
                    #product_inst.save()
                    sale_invoice_item.save()
                    
                store = models.Store.objects.get(name=employee_inst.store)
                store_name = store.name
                store_code = store.code
                d=datetime.datetime.now()
                credit_redeem = models.CreditRedeem.objects.create(
                    customer=cus,
                    credit_note=credit_number,
                    redeem_invoice = invoice,
                    redeem_store=store,
                    redeem_amount=redeem_amount,
                    redeem_by=bill_user.store_employee,
                    redeem_date=datetime.date.today(),
                    redeem_time=d.strftime("%X"),
                )
                credit_redeem.save()
                credit_number.available_amount = credit_number.available_amount-int(redeem_amount)
                credit_number.save()
                #store_employee_sale = models.StoreEmployeeSale.objects.get(employee=employee_inst)
                #store_employee_sale.sold_qty = store_employee_sale.sold_qty+len(items)
                #store_employee_sale.sold_amount = store_employee_sale.sold_amount+Decimal(total_bill)
                #store_employee_sale.save()
                bill_data = {
                        'invoice_number': invoice.invoice_number,
                        'customer_name':customer_inst.name,
                        'customer_number':customer_inst.mobile_number,
                        'sub_total': subtotal_amount,
                        'discount':  discount,
                        'tax_amount':gst,
                        'total_bill': total_bill,
                        'total_items':quatity,
                        'bill_by':bill_user.store_employee.name,
                        'store_code':store_code,
                        'store_name': store_name,
                        'items': bill_items,
                        'bill_time':d.strftime("%X"),
                         'bill_date':datetime.date.today()
                }
                #generate_bill(bill_data)
                return Response(status=status.HTTP_200_OK)
        cart = models.Cart.objects.create(customer=customer_inst,
                                                  sold_by=employee_inst.name,
                                                  subtotal_amount=subtotal_amount, 
                                                  discount=discount, 
                                                  gst=gst, 
                                                  quatity=quatity, 
                                                  total_paid=total_paid, 
                                                  total_change=total_change, 
                                                  total_due=total_due, 
                                                  total_bill=total_bill
                                                  )
        cart.save()
                
                #loyalty points calculations
        purchase_amount = int(request.data.get('totalBill'))
        new_points = purchase_amount/100
        print(new_points)
            
        from decimal import Decimal
        customer_inst.total_points = customer_inst.total_points+Decimal(new_points)
        customer_inst.total_amount_purchase = customer_inst.total_amount_purchase+purchase_amount        
        customer_inst.save()
                # invoice
        avg_mrp_price = int(total_bill)/int(quatity)
        inv = get_invoice_number
        invoice = models.SaleInvoice.objects.create(
                    invoice_number = inv,
                    customer=customer_inst,
                    subtotal_amount = subtotal_amount,
                    discount=discount,
                    tax_amount=gst,
                    total_items=quatity,
                    total_bill=total_bill,
                    avg_mrp=avg_mrp_price,
                    cash_amount=payment_data['cash'],
                    card_amount=payment_data['card'],
                    points_amount=payment_data['points'],
                    voucher_amount=payment_data['voucher'],
                    gift_card_amount=payment_data['gift_card'],
                    credit_note = payment_data['credit_amount'],
                    store=bill_user.store_employee.store,
                    sold_by=employee_inst.name,
                    bill_by=bill_user.store_employee.name    
                )
        invoice.save()
                # items saving
        items = request.data.get('items')
                
        bill_items = []
        for i in range(len(items)):
            product_inst = models.Product.objects.get(barcode=items[i]['product']['barcode'])
            bill_items.append(product_inst)
            store_inst = employee_inst.store
            d=datetime.datetime.now()
            cart_item = models.CartItem.objects.create(product=product_inst, 
                                                               customer=customer_inst, 
                                                               sold_by=employee_inst.name,
                                                               unit_price=items[i]['product']['mrp_cost'],
                                                                sold_price=items[i]['product']['mrp_cost'],
                                                                sold_date=datetime.date.today(),
                                                                sold_time=d.strftime("%X"),
                                                                store=store_inst 
                                                                )
            cart_item.save()
            sale_invoice_item = models.SaleInvoiceItem.objects.create(
                                    sale_invoice = invoice,
                                    item = product_inst,
                                    unit_price=items[i]['product']['mrp_cost'],
                                    sold_price=items[i]['product']['mrp_cost'],
                                    store=store_inst,
                                    sold_by=employee_inst.name,
                                    bill_by=bill_user.store_employee.name,
                                    bill_date=datetime.date.today(),
                                    bill_time=d.strftime("%X")
                    )
            #sp = models.PosProduct.objects.get(product=product_inst)
            #sp.av_quantity = sp.av_quantity-1
            #sp.save()
            sale_invoice_item.save()
            #print(sale_invoice_item.invoice_number)
                    
        store = models.Store.objects.get(name=employee_inst.store)
        store_name = store.name
        store_code = store.code
        d=datetime.datetime.now()
        #emp_sale=employee_inst.store_empployee_sales.create(employee=employee_inst, )
        #store_employee_sale = models.StoreEmployeeSale.objects.get(employee=employee_inst)
        #store_employee_sale.sold_qty = store_employee_sale.sold_qty+len(items)
        #store_employee_sale.sold_amount = store_employee_sale.sold_amount+Decimal(total_bill)
        #store_employee_sale.save()
        bill_data = {
                        'invoice_number': invoice.invoice_number,
                        'customer_name':customer_inst.name,
                        'customer_number':customer_inst.mobile_number,
                        'sub_total': subtotal_amount,
                        'discount':  discount,
                        'tax_amount':gst,
                        'total_bill': total_bill,
                        'total_items':quatity,
                        'bill_by':bill_user.store_employee.name,
                        'store_code':store_code,
                        'store_name': store_name,
                        'items': bill_items,
                        'bill_time':d.strftime("%X"),
                         'bill_date':datetime.date.today()
                }
        print(bill_data)
        #generate_bill(bill_data)
        return Response(status=status.HTTP_200_OK)
        

@api_view(['GET', 'POST'])
def create_credit_note(request):
    if request.method == 'POST':        
        print(request.data)
        user = request.data.get('emp')
        b_user = User.objects.get(id=user)
        invoice_inst = models.SaleInvoice.objects.get(invoice_number=request.data.get('credit_invoice'))
        store_inst = models.Store.objects.get(name=b_user.store_employee.store)            
        ci = invoice_inst
        cm = request.data.get('credit_amount')
        issue = request.data.get('issue')
        customer = request.data.get('customer')
        credit_note = models.CreditNote.objects.create(
            customer = customer,
            credit_invoice=ci,
            credit_amount=cm,
            available_amount=cm,
            issue = issue,
            credit_date = datetime.date.today(),
            valid_from = datetime.date.today(),
            created_store = store_inst,
            credit_made = b_user.store_employee
        )
        print(credit_note)
        credit_note.save()
        return Response(status=status.HTTP_200_OK)
    return Response({"error":"Something wrong"})
        
        
@api_view(['GET', 'POST'])
def create_credit_redeem(request):
    if request.method == 'POST':
        cn_number = request.data.get('credit_number')
        user = request.data.get('emp')
        b_user = User.objects.get(id=user)
        credit_note_inst = models.CreditNote.objects.get(credit_number=cn_number)
        store_inst = models.Store.objects.get(name=b_user.store_employee.store)            
        customer = request.data.get('customer')
        redeem_amount = request.data.get('redeem_amount')
        print(redeem_amount)
        d=datetime.datetime.now()
        credit_redeem = models.CreditRedeem.objects.create(
            customer=customer,
            credit_note=credit_note_inst,
            redeem_store=store_inst,
            redeem_amount=redeem_amount,
            redeem_by=b_user.store_employee,
            redeem_date=datetime.date.today(),
            redeem_time=d.strftime("%X"),
        )
        credit_redeem.save()
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET', 'POST'])
def get_customer_purchase_history(request):
    if request.method == 'GET':
        purchase_items = models.CartItem.objects.all()
        serializer = serializers.CartItemSerializer(purchase_items, many=True)
        return Response(serializer.data)
        
        
@api_view(['GET', 'POST'])
def get_latest_style_number(request):
    if request.method == 'GET':
        style_number = models.StyleNumber.objects.latest('id')
        serializer = serializers.LatesetStyleNumberSerializer(style_number)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

def article_number_creator(brand, group,mc):
    def id_generator(size=4,chars=string.digits):
        return ''.join(random.choice(chars) for _ in range(size))
    
    digit = id_generator()
    new_an_number = brand+group+mc+str(str(datetime.date.today().year))+digit
    return new_an_number
    
@api_view(['GET', 'POST'])
def article_number_create(request):
    if request.method == 'POST':
        serializer = serializers.ArticleNumberSerializer(data=request.data)
        if serializer.is_valid():
            sn = request.data.get('style_number')
            group = request.data.get('group')
            color = request.data.get('color')
            material_code = request.data.get('material_code')
            po_number = request.data.get('po_number')
            vendor = request.data.get('vendor')
            sn_instance = models.StyleNumber.objects.get(style_number=sn)
            brand = sn_instance.brand    
            article_number =article_number_creator(brand[:2], group[:1], material_code[:1])
            models.ArticleNumber.objects.create(style_number=sn, group=group, color=color, material_code=material_code, po_number=po_number, vendor=vendor,article_number=article_number)


@api_view(['GET', 'POST'])
def get_latest_article_number(request):
    if request.method == 'GET':
        an = models.ArticleNumber.objects.latest('id')
        serializer = serializers.LatestArticleSerializer(an)
        return Response(serializer.data, status=status.HTTP_200_OK)
        


        
@api_view(['GET', 'POST'])
def corporate_all_products(request):
    if request.method == 'GET':
        products= models.Product.objects.all()
        serializer = serializers.ProductSerializer(products, many=True)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
def corporate_current_stock_in_warehouse(request):
    if request.method == 'GET':
        products = models.Product.objects.all()
        serializer = serializers.ProductSerializer(products, many=True)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
def ws_product_transfer(request):
    if request.method == 'POST':
        #serializer = serializers.WareHouseTransferSerializer(data=request.data)
        #if serializer.is_valid():
        store_inst = request.data.get('store')
        store = models.Store.objects.get(name=store_inst)
        products = request.data.get('products')
        quantity = request.data.get('total_qty')
        transfer_origin = 'CORPORATE'
        for i in range(len(products)):
            product_inst = models.Product.objects.get(barcode=products[i]['product']['barcode'])
            product_qty = products[i]['quantity']          
            tp = models.WSTransferProduct.objects.create(
                    store=store,
                    product=product_inst,
                    trans_quantity=product_qty,
                    transfer_origin=transfer_origin
                    )
            tp.save()
        wt = models.WSTransaction.objects.create(store=store, 
                                                 quantity=quantity, 
                                                    total_products = len(products),
                                                    transfer_origin=transfer_origin)
        wt.save()

        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def store_product_transfer_request(request):
    if request.method == 'POST':
        #serializer = serializers.WareHouseTransferSerializer(data=request.data)
        #if serializer.is_valid():
        product = request.data.get('product')
        store_inst = product['store']['name']
        store = models.Store.objects.get(name=store_inst)
        product_inst = models.Product.objects.get(barcode=product['product']['barcode'])
        sp = models.StoreProduct.objects.create(store=store, product=product_inst, quantity=product['trans_quantity'])
        sp.save()
        print("saved")
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET', 'POST'])
def store_product_transfer_request(request):
    if request.method == 'POST':
        #serializer = serializers.WareHouseTransferSerializer(data=request.data)
        #if serializer.is_valid():
        product = request.data.get('product')
        store_inst = product['store']['name']
        store = models.Store.objects.get(name=store_inst)
        product_inst = models.Product.objects.get(barcode=product['product']['barcode'])
        sp = models.StoreProduct.objects.create(store=store, product=product_inst, quantity=product['trans_quantity'])
        sp.save()
        print("saved")
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET', 'POST'])
def get_store_product_transfer_request(request):
    if request.method == 'GET':
        print(request.META.get('HTTP_AUTHORIZATION', " "))
        t = request.META.get('HTTP_AUTHORIZATION', " ")
        print(request.user)
        token = Token.objects.get(key=t)
        user = User.objects.get(id=token.user_id)
        store=user.store_manager.store
        store_inst = models.Store.objects.get(name=store)
        products = models.StoreProduct.objects.filter(store=store_inst, is_recieved=False)
        serializer = serializers.StoreTransferRequestSerializer(products, many=True)
        return Response(serializer.data,status=status.HTTP_201_CREATED)  
    

@api_view(['GET', 'POST'])
def get_store_products(request):
    if request.method == 'GET':
        print(request.META.get('HTTP_AUTHORIZATION', " "))
        t = request.META.get('HTTP_AUTHORIZATION', " ")
        print(request.user)
        token = Token.objects.get(key=t)
        user = User.objects.get(id=token.user_id)
        store=user.store_employee.store
        store_inst = models.Store.objects.get(name=store)
        products = models. PosProduct.objects.filter(store=store_inst)
        serializer = serializers.PosProductSerializer(products, many=True)
        return Response(serializer.data,status=status.HTTP_201_CREATED)  
    

@api_view(['GET', 'POST'])
def store_accept_product(request):
    if request.method == 'POST':       
        prod = request.data.get('product')
        print(prod)
        request_product = prod['product']['barcode']
        print(request_product)
        request_store = prod['store']['name']
        quantity = request.data.get('quantity')
        store = models.Store.objects.get(name=request_store)
        product = models.Product.objects.get(barcode=request_product)
        sp = models.StoreProduct.objects.get(product=product, store=store, is_recieved=False)
        print(sp.is_recieved)
        print(store)
        print(product)
        pos_product = models.PosProduct.objects.filter(store=store,product=product).exists()
        if pos_product:
            p = models.PosProduct.objects.get(store=store_inta,product=product)
            p.quantity = p.quantity+quantity
            p.save()
        pp = models.PosProduct.objects.create(store=store, product=product, quantity=quantity)
        sp.is_recieved = True
        sp.save()
        return Response(status=status.HTTP_200_OK)
        
        
@api_view(['GET', 'POST'])
def store_product_transfer(request):
    if request.method == 'POST':
        serializer = serializers.StoreTransferSerializer(data=request.data)
        if serializer.is_valid():
            store_inst = request.data.get('store')
            store = models.Store.objects.get(name=store_inst)
            products = request.data.get('products')
            transfer_origin = 'CORPORATE'
            for i in range(len(products)):
                product_inst = models.Product.objects.get(barcode=products[i].product.barcode)
                product_qty = products[i].quantity
                tp = models.WSTransferProduct.objects.create(
                    store=store,
                    product=product_inst,
                    trans_quantity=product_qty,
                    transfer_origin=transfer_origin
                    )
                tp.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
@api_view(['GET', 'POST'])
def ws_product_inward_accept(request):
    if request.method == 'POST':
        print(request.data)        
        serializer = serializers.WareHouseInwardSerializer(data=request.data)        
        if serializer.is_valid():
            product_inst = request.data.get('product')
            product_inst = models.WSTransferProduct.objects.get(id=product_inst)
            product_inst.accepted_date=datetime.datetime.now()
            product_inst.accepted = True
            product_inst.updated_at = datetime.datetime.now()
            product_inst.accepted_note=request.data.get('accepted_note')
            product_inst.save()

        return Response(status=status.HTTP_201_CREATED)


@api_view(['GET', 'POST'])
def ws_tranfer_area_list(request):
    if request.method == 'GET':
        products = models.WSTransferProduct.objects.filter(accepted=True)
        serializer = serializers.WareHouseTransferDetailSerializer(products, many=True)
        return Response(serializer.data)


@api_view(['GET', 'POST'])
def ws_inward_area_list(request):
    if request.method == 'GET':
        products = models.WSTransferProduct.objects.filter(accepted=False)
        serializer = serializers.WareHouseTransferDetailSerializer(products, many=True)
        return Response(serializer.data)        
        


from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
from django.contrib.auth import authenticate




class LoginApi(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        authenticate(request.data)
        print(user)
        return super(LoginApi, self).post(request, format=None)
        
 
@api_view(['GET', 'POST', ])
def check_username(request):
    user_input = request.data.get('user_name', None)
    user_instance = User.objects.filter(username=user_input).exists()
    if user_instance:
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET', 'POST', ])
def check_credit_number(request):
    cn_input = request.data.get('redeem_credit_number_input', None)
    print(cn_input)
    cn_instance = models.CreditNote.objects.filter(credit_number=cn_input, status=False).exists()
    if cn_instance:
        cn = models.CreditNote.objects.get(credit_number=cn_input)
        cn_serializer = serializers.CreditNoteSerializer(cn)
        return Response(cn_serializer.data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)
    
    

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response


class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super(CustomObtainAuthToken, self).post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        user = User.objects.get(id=token.user_id)
        return Response({'token': token.key, 'id': token.user_id, 'user': user.username})