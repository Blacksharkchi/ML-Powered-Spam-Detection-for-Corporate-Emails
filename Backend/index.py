import os
import pandas as pd

def load_emails("Downloads/archive (1)", label):
    emails = []
    for filename in os.listdir("Downloads/archive (1)"):
        with open(os.path.join("Downloads/archive (1)", filename), 'r', encoding='latin-1') as file:
            emails.append({'text': file.read(), 'label':label})
    return pd.DataFrame(emails)

# Load Enron 1
enron1_ham = load_emails('Downloads/archive (1)/enron1/ham', 'ham')
enron1_spam = load_emails('Downloads/archive (1)/enron1/spam', 'spam')

# Load Enron 2
enron2_ham = load_emails('Downloads/archive (1)/enron2/ham', 'ham')
enron2_spam = load_emails('Downloads/archive (1)/enron2/spam', 'spam')

# Load Enron 3
enron3_ham = load_emails('Downloads/archive (1)/enron3/ham', 'ham')
enron3_spam = load_emails('Downloads/archive (1)/enron3/spam', 'spam')

# Load Enron 4
enron4_ham = load_emails('Downloads/archive (1)/enron4/ham', 'ham')
enron4_spam = load_emails('Downloads/archive (1)/enron4/spam', 'spam')

# Load Enron 5
enron5_ham = load_emails('Downloads/archive (1)/enron5/ham', 'ham')
enron5_spam = load_emails('Downloads/archive (1)/enron5/spam', 'spam')

# Load Enron 6
enron6_ham = load_emails('Downloads/archive (1)/enron6/ham', 'ham')
enron6_spam = load_emails('Downloads/archive (1)/enron6/spam', 'spam')

# combine datasets
df = pd.concat([enron1_ham, enron1_spam, enron2_ham, enron2_spam, enron3_ham, enron3_spam, enron4_ham, enron4_spam, enron5_ham, enron5_spam, enron6_ham, enron6_spam],
               ignore_index=True)
print(df['label'].value_counts())

# save the combined dataset
df.to_csv('emails_dataset.csv', index=False)

print("Combined dataset saved as 'emails_dataset.csv'")
