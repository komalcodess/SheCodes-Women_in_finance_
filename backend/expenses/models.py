
from django.db import models


class Expense(models.Model):
    TRANSACTION_TYPES = [
        ("expense", "Expense"),
        ("income", "Income"),
    ]

    CATEGORY_CHOICES = [
        ("Food", "Food"),
        ("Travel", "Travel"),
        ("Shopping", "Shopping"),
        ("Bills", "Bills"),
        ("Health", "Health"),
        ("Education", "Education"),
        ("Business", "Business"),
        ("Other", "Other"),
    ]

    title = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPES,
        default="expense",
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="Other",
    )
    notes = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - ₹{self.amount}"
class Budget(models.Model):
    category = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.DateField()

class Goal(models.Model):
    name = models.CharField(max_length=100)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    saved_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

class Investment(models.Model):
    name = models.CharField(max_length=100)
    amount_invested = models.DecimalField(max_digits=12, decimal_places=2)
    current_value = models.DecimalField(max_digits=12, decimal_places=2)
    investment_type = models.CharField(max_length=50)

class LearningLesson(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=100)