"""
Author: Bala
Description :  Product Configurations models lives here
"""
import uuid
import datetime
from django.db import models
from django.utils.translation import ugettext as _
from django.core.validators import ValidationError

from .base_models import TimeStampModel,BaseMetaDetail

class ProductFile(models.Model):
    document = models.FileField(upload_to='products/documents/')
    description = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.description
        
        
class Season(BaseMetaDetail, TimeStampModel):
    """
    Brand Model.
    @param id autofield: django generates
    @param uid: unique identification id for each season
    @param name: string : Name of the season
    """
    
    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name = _("Seasons")
        verbose_name_plural = _("Seasons")


class Collection(BaseMetaDetail, TimeStampModel):
    """
    Collection Model.
    
    @param id autofield: django generates
    @param uid: unique identification id for each collection
    @param name: string : Name of the collection
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Collections")
        verbose_name_plural = _("Collections")        


class Phase(BaseMetaDetail, TimeStampModel):
    """
    Phase Model.

    @param id autofield: django generates
    @param uid: unique identification id for each phase
    @param name: string : Name of the phase
   
    """
    
    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name = _("Phase")
        verbose_name_plural = _("Phases")


class Department(BaseMetaDetail,TimeStampModel):
    """
    Department Model.
    """
    class Meta:
        verbose_name = _("Departments")
        verbose_name_plural = _("Departments")
    
    def __str__(self):
        return self.name
        
        
class Brand(BaseMetaDetail, TimeStampModel):
    """
    Brand Model.
    @param id autofield: django generates
    @param uid: unique identification id for each brand
    @param name: string : Name of the brand
    """
    
    def __str__(self):
        return self.name
    

    class Meta:
        verbose_name = _("Brands")
        verbose_name_plural = _("Brands")


class Category(BaseMetaDetail, TimeStampModel):
    """
    Brand Model.
    @param id autofield: django generates
    @param uid: unique identification id for each brand
    @param name: string : Name of the brand
    """
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Categories")
        verbose_name_plural = _("Categories")

class Gender(BaseMetaDetail, TimeStampModel):
    """
    Gender Model.
    
    @param id autofield: django generates
    @param uid: unique identification id for each gender
    @param name: string : Name of the gender
    """
    
    def __str__(self):
        return self.name
    

    class Meta:
        verbose_name = _("GENDERS")
        verbose_name_plural = _("GENDERS")
        
        
class PGroup(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("PGroup")
        verbose_name_plural = _("PGroup")
        

class Combo(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Combo")
        verbose_name_plural = _("Combo")


class Color(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Color")
        verbose_name_plural = _("Color")
        
    
class Weave(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Combo")
        verbose_name_plural = _("Combo")


class MajorFabric(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Major Fabric")
        verbose_name_plural = _("Major Fabric")


class FabricDetails(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Fabric Details")
        verbose_name_plural = _("Fabric Details")


class FabricCare(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Fabric Care")
        verbose_name_plural = _("Fabric Care")
        
        
class Neck(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Neck")
        verbose_name_plural = _("Neck")
        
        
class Fit(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Fit")
        verbose_name_plural = _("Fit")


class Shape(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Shape")
        verbose_name_plural = _("Shape")
        

class Hemline(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Hemline")
        verbose_name_plural = _("Hemline")
        

class Length(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Length")
        verbose_name_plural = _("Length")


class Sleeve(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Sleeve")
        verbose_name_plural = _("Sleeve")


class Occasion(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Occasion")
        verbose_name_plural = _("Occasion")


class BaseType(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Base Type")
        verbose_name_plural = _("Base Type")
        

class Surface(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Surface")
        verbose_name_plural = _("Surface")


class Closure(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Closure")
        verbose_name_plural = _("Closure")
         

class Shade(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Shade")
        verbose_name_plural = _("Shade")
        

class Stretch(BaseMetaDetail, TimeStampModel):
    """
   
    """
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Stretch")
        verbose_name_plural = _("Stretch")


class Rise(BaseMetaDetail, TimeStampModel):
    """
    """
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Stretch")
        verbose_name_plural = _("Stretch")
        


            
            
class StyleNumber(TimeStampModel):
    """
    """
    brand = models.CharField(max_length=50,
    null=True,
    blank=True
    )

    category=models.CharField(
    max_length=50,
    null=True,
    blank=True    
    )

    gender=models.CharField(
    max_length=50,
    null=True,
    blank=True    
    )
    
    weave=models.CharField(
    max_length=50,
    null=True,
    blank=True    
    )


    style_number = models.PositiveIntegerField(
    editable=False,
    null=True,
    blank=True
    )
    style_code = models.CharField(
    max_length=200,
    editable=False,
    null=True,blank=True
    )


    def __str__(self):
        return str(self.style_number)


    
    
class ArticleNumber(TimeStampModel):
    """
    """
    article_number = models.CharField(
    max_length=50, 
    null=True, blank=True,
    )    
    uid = models.UUIDField(
    default=uuid.uuid4, 
    editable=False
    )    
    style_number = models.CharField(
    max_length=50, 
    null=True, blank=True,
    )
    group = models.CharField(max_length=50, null=True, blank=True                              
    )
    color = models.CharField(max_length=25)
    material_code = models.CharField(max_length=25)
    po_number = models.CharField(max_length=25)
    vendor = models.CharField(max_length=25)
    shelf_life = models.CharField(
    max_length=3,
    null=True,
    default=True
    )

    
    def __str__(self):
        return self.article_number
    
    def save(self, *args, **kwargs):
       
        super(ArticleNumber, self).save(*args, **kwargs)
    

def barcode_creator(sn):
    
    prd = Product.objects.filter(barcode__contains=str(10001)).exists()
    if prd:
        pd = Product.objects.order_by('-pk')[0]
        print(pd.barcode[-5:])
        new_bc = int(pd.barcode[-5:])+1  
        return sn+str(new_bc)

    number=10001
    return sn+str(number)
    
        
        
class Product(TimeStampModel):
    """
    """
    article_number = models.CharField(max_length=15, null=True, blank=True)
    purchase = models.CharField(max_length=25, null=True, blank=True)
    size = models.CharField(max_length=15, null=True, blank=True)
    phase = models.CharField(max_length=15, null=True, blank=True)
    landed_cost = models.DecimalField(max_digits=10, decimal_places=2)
    mrp_cost = models.DecimalField(max_digits=10, decimal_places=2)
    gst = models.DecimalField(max_digits=10, decimal_places=2)
    additional_expense = models.DecimalField(max_digits=10, decimal_places=2)
    phase = models.CharField(null=True, blank=True, max_length=100)
    weave = models.CharField(max_length=15, null=True, blank=True)
    major_fabric = models.CharField(max_length=15, null=True, blank=True)
    fabric_detials = models.CharField(max_length=15, null=True, blank=True)
    fabric_care = models.CharField(max_length=15, null=True, blank=True)
    neck = models.CharField(max_length=15, null=True, blank=True)
    fit = models.CharField(max_length=15, null=True, blank=True)
    shape = models.CharField(max_length=15, null=True, blank=True)
    hemline = models.CharField(max_length=15, null=True, blank=True)
    length = models.CharField(max_length=15, null=True, blank=True)
    sleeve = models.CharField(max_length=15, null=True, blank=True)
    occasion = models.CharField(max_length=15, null=True, blank=True)
    base_type = models.CharField(max_length=15, null=True, blank=True)
    surface = models.CharField(max_length=15, null=True, blank=True)
    closure = models.CharField(max_length=15, null=True, blank=True)
    batch = models.CharField(max_length=15, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    av_quantity = models.PositiveIntegerField(null=True, blank=True)
    ordered = models.DateField(null=True, blank=True)
    received = models.DateField(null=True, blank=True)
    shade = models.CharField(max_length=15, null=True, blank=True)
    stretch = models.CharField(max_length=15, null=True, blank=True)
    rise = models.CharField(max_length=15, null=True, blank=True)    
    description = models.CharField(max_length=300, null=True, blank=True)    
    barcode = models.CharField(max_length=13,blank=True, null=True)
    
    style_number = models.CharField(max_length=15, blank=True, null=True)
    group = models.CharField(max_length=50, null=True, blank=True                              
    )
    color = models.CharField(max_length=25, null=True, blank=True)
    material_code = models.CharField(max_length=25, null=True, blank=True)
    po_number = models.CharField(max_length=25, null=True, blank=True)
    vendor = models.CharField(max_length=25, null=True, blank=True)
    shelf_life = models.CharField(
    max_length=3,
    null=True,blank=True,
    default=True
    )
    brand = models.CharField(max_length=50,
    null=True,
    blank=True
    )

    category=models.CharField(
    max_length=50,
    null=True,
    blank=True    
    )

    gender=models.CharField(
    max_length=50,
    null=True,
    blank=True    
    )
    image = models.ImageField(
        upload_to='images/products/%yy/%mm/%dd',
        null=True,
        blank=True
    )    
    
    def __str__(self):
        return self.barcode
        
    def save(self, *args, **kwargs):
        """
        an = ArticleNumber.objects.get(article_number=self.article_number)
        print(an)
        snn=StyleNumber.objects.get(style_number=an.style_number)
        sn = snn.style_code
        self.style_number = snn
        self.barcode = barcode_creator(sn)
        self.description = an.color+snn.brand+snn.category+snn.gender
        self.group = an.group
        self.color = an.color
        self.material_code = an.material_code
        self.po_number = an.po_number
        self.vendor = an.vendor
        self.shelf_life = an.shelf_life
        self.brand = snn.brand
        self.category = snn.category
        self.gender = snn.gender
        """
        super(Product, self).save(*args, **kwargs)
        